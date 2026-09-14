const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const validateSession = require('../src/utils/validateSession');
function load(file, mocks) {
    const module = { exports: {} };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src', file), 'utf8'), {
        module, exports: module.exports, console: { error() {} }, process,
        require: name => { if (!(name in mocks)) throw Error('Unexpected dependency: ' + name); return mocks[name]; }
    });
    return module.exports;
}
function response() { return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
const session = { date: '2026-09-14', start_time: '09:00', end_time: '10:00:00' };
for (const [label, patch, expected] of [
    ['valid interval', {}, true], ['impossible date', { date: '2026-02-30' }, false],
    ['invalid hour', { start_time: '25:00' }, false], ['reversed interval', { end_time: '08:00' }, false],
    ['equal mixed precision times', { end_time: '09:00:00' }, false], ['missing time', { start_time: undefined }, false]
]) test(label, () => assert.equal(validateSession({ ...session, ...patch }), expected));
test('roles reject guests and coaches but admit admins', () => {
    const guard = require('../src/middlewares/requireRole')('Admin');
    for (const [user, code] of [[null, 401], [{ role: 'Coach' }, 403], [{ role: 'Admin' }, 200]]) {
        const res = response(); let called = false;
        guard({ user }, res, () => { called = true; });
        assert.equal(res.code, code); assert.equal(called, code === 200);
    }
});
test('login rejects missing passwords before querying users', async () => {
    const controller = load('controllers/auth.controller.js', { bcryptjs: {}, jsonwebtoken: {}, '../models/mysql/User': {} });
    const res = response(); await controller.login({ body: { username: 'coach' } }, res); assert.equal(res.code, 400);
});
test('inactive users cannot log in', async () => {
    const controller = load('controllers/auth.controller.js', { bcryptjs: {}, jsonwebtoken: {}, '../models/mysql/User': { findOne: async () => ({ status: 'Inactive' }) } });
    const res = response(); await controller.login({ body: { username: 'coach', password: 'secret' } }, res); assert.equal(res.code, 401);
});
test('existing tokens are rejected after account deactivation', async () => {
    const auth = load('middlewares/auth.middleware.js', { jsonwebtoken: { verify: () => ({ user_id: 1 }) }, '../models/mysql/User': { findByPk: async () => ({ status: 'Inactive' }) } });
    const res = response(); await auth({ headers: { authorization: 'Bearer valid-token' } }, res, () => assert.fail('must not authorize')); assert.equal(res.code, 401);
});
const sportMocks = sport => ({ '../models/mysql/Sport': sport, '../models/mysql/User': {}, '../models/mysql/Team': {}, '../models/mysql/TeamMember': {} });
test('sport fetch errors produce a JSON 500 response', async () => {
    const controller = load('controllers/sport.controller.js', sportMocks({ findAll: async () => { throw Error('offline'); } }));
    const res = response(); await controller.getAllSports({}, res); assert.equal(res.code, 500);
});
test('invalid sport decisions never delete records', async () => {
    const controller = load('controllers/sport.controller.js', sportMocks({}));
    const res = response(); await controller.updateSportStatus({ params: { id: 1 }, body: { action: 'typo' } }, res); assert.equal(res.code, 400);
});
const scheduleMocks = (schedule, sport = {}) => ({ '../utils/validateSession': validateSession, '../models/mysql/Schedule': schedule, '../models/mysql/Sport': sport, '../models/mysql/Team': {}, '../models/mysql/Venue': {}, '../models/mysql/User': {}, '../models/mysql/Booking': {}, sequelize: { Op: {} } });
test('missing schedule approval returns once without querying conflicts', async () => {
    const controller = load('controllers/schedule.controller.js', scheduleMocks({ findByPk: async () => null }));
    const res = response(); await controller.approveSchedule({ params: { id: 1 } }, res); assert.equal(res.code, 404);
});
test('coach cannot take another schedule by replacing its sport', async () => {
    const controller = load('controllers/schedule.controller.js', scheduleMocks({ findByPk: async () => ({ sport_id: 9 }) }, { findOne: async () => null }));
    const res = response(); await controller.updateCoachSchedule({ params: { id: 1 }, user: { user_id: 2 }, body: { sport_id: 2, ...session } }, res); assert.equal(res.code, 403);
});
test('failed team edit rolls back its transaction', async () => {
    let rolledBack = false;
    const transaction = { rollback: async () => { rolledBack = true; } };
    const controller = load('controllers/team.controller.js', { '../models/mysql/Team': { findByPk: async () => { throw Error('database failure'); } }, '../models/mysql/Sport': {}, '../models/mysql/TeamMember': {}, '../config/mysql': { transaction: async () => transaction } });
    const res = response(); await controller.editTeamRequest({ params: { id: 1 }, body: {} }, res);
    assert.equal(res.code, 500); assert.equal(rolledBack, true);
});
test('mail failure preserves committed booking status and uses stored recipient', async () => {
    let updated; let recipient;
    const controller = load('controllers/booking.controller.js', {
        '../utils/validateSession': validateSession,
        '../models/mysql/Booking': { findByPk: async () => ({ email: 'owner@example.com', event_name: 'Practice', update: async value => { updated = value; } }) },
        '../models/mysql/Sport': {}, '../models/mysql/Venue': {}, '../models/mysql/Schedule': {}, sequelize: { Op: {} },
        nodemailer: { createTransport: () => ({ sendMail: async options => { recipient = options.to; throw Error('offline'); } }) }
    });
    const res = response(); await controller.updateBookingStatus({ params: { id: 1 }, body: { status: 'Rejected', user_email: 'other@example.com' } }, res);
    assert.equal(updated.status, 'Rejected'); assert.equal(recipient, 'owner@example.com'); assert.equal(res.code, 200); assert.equal(res.body.emailSent, false);
});
for (const name of ['news', 'announcement']) test(name + ' rejects invalid updates as client errors', async () => {
    const model = name === 'news' ? 'News' : 'Announcement';
    const controller = load('controllers/' + name + '.controller.js', { ['../models/mongo/' + model]: { findByIdAndUpdate: async (id, body, options) => { assert.equal(options.runValidators, true); throw Object.assign(Error('invalid'), { name: 'ValidationError' }); } } });
    const res = response(); await controller['update' + model]({ params: { id: 'invalid' }, body: {} }, res); assert.equal(res.code, 400);
});

test('coach edits return their team to admin review in one transaction', async () => {
    let updated; const transaction = {};
    const controller = load('controllers/team.controller.js', {
        '../models/mysql/Team': { findByPk: async () => ({ sport_id: 1, status: 'Active', update: async (value, options) => { updated = value; assert.equal(options.transaction, transaction); } }) },
        '../models/mysql/Sport': { findOne: async () => ({ coach_id: 2 }) }, '../models/mysql/TeamMember': {},
        '../config/mysql': { transaction: async callback => callback(transaction) }
    });
    const res = response(); await controller.updateTeam({ params: { id: 1 }, user: { user_id: 2, role: 'Coach' }, body: { team_name: 'Changed', status: 'Active' } }, res);
    assert.equal(res.code, 200); assert.equal(updated.status, 'Inactive');
});
test('coaches cannot delete another coach team', async () => {
    const controller = load('controllers/team.controller.js', {
        '../models/mysql/Team': { findByPk: async () => ({ sport_id: 1, destroy: () => assert.fail('must not delete') }) },
        '../models/mysql/Sport': { findOne: async () => null }, '../models/mysql/TeamMember': {}, '../config/mysql': {}
    });
    const res = response(); await controller.deleteTeam({ params: { id: 1 }, user: { user_id: 2, role: 'Coach' } }, res); assert.equal(res.code, 403);
});

for (const [name, method, route, role, expected] of [
    ['user', 'get', '/', null, 401], ['user', 'post', '/', 'Coach', 403], ['user', 'get', '/', 'Admin', 200],
    ['booking', 'put', '/:id/status', null, 401], ['booking', 'put', '/:id/status', 'Coach', 403],
    ['booking', 'post', '/', null, 200], ['announcement', 'get', '/', null, 200],
    ['news', 'delete', '/:id', null, 401], ['venue', 'get', '/', null, 200],
    ['contactRequest', 'get', '/:id/attachment', null, 401]
]) test(name + ' ' + method + ' ' + route + ' as ' + (role || 'guest'), async () => {
    const registered = [];
    const router = {};
    for (const verb of ['get', 'post', 'put', 'patch', 'delete']) router[verb] = (url, ...handlers) => registered.push({ verb, url, handlers });
    const controller = new Proxy({}, { get: () => (req, res) => res.json({ ok: true }) });
    load('routers/' + name + '.routes.js', {
        express: { Router: () => router },
        '../middlewares/requireRole': require('../src/middlewares/requireRole'),
        '../middlewares/auth.middleware': (req, res, next) => role ? (req.user = { role }, next()) : res.status(401).json({ message: 'No token' }),
        ['../controllers/' + name + '.controller']: controller,
        '../middlewares/upload': { single: () => (req, res, next) => next() }
    });
    const handlers = registered.find(item => item.verb === method && item.url === route).handlers;
    const res = response(); let index = 0;
    // Share the request between middleware so authentication reaches authorization.
    const req = {}; index = 0;
    const advance = () => handlers[index++]?.(req, res, advance);
    await advance(); assert.equal(res.code, expected);
});
