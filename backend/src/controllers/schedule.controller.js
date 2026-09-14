const validateSession = require('../utils/validateSession');
const Schedule = require('../models/mysql/Schedule');
const Sport = require('../models/mysql/Sport');
const Team = require('../models/mysql/Team');
const Venue = require('../models/mysql/Venue');
const User = require('../models/mysql/User')
const Booking = require('../models/mysql/Booking');
const { Op } = require('sequelize');

/** Create new schedule requests */
exports.createScheduleRequest = async (req, res) => {
    try {
        const { sport_id, venue_id, date, start_time, end_time, type } = req.body;

        if (!sport_id || !venue_id || !date || !start_time || !end_time || !type) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!validateSession({ date, start_time, end_time }) || !['Practice', 'Match'].includes(type)) {
            return res.status(400).json({ message: 'Invalid session date, time or type' });
        }
        const ownedSport = await Sport.findOne({ where: { sport_id, coach_id: req.user.user_id } });
        if (!ownedSport) return res.status(403).json({ message: 'Unauthorized sport' });
        const schedule = await Schedule.create({
            sport_id, 
            venue_id,
            date,
            start_time,
            end_time,
            type,
            status: 'Pending'
        });

        res.status(201).json(schedule);
    }
    catch (error) {
        console.error('Error creating schedule request: ', error);
        res.status(500).json({ message: 'Failed to create schesule request.' });
    }
}



/** Get all approved and pending Schedules for a coach */
exports.getMySchedules = async (req, res) => {
    try {
        const coachId = req.user.user_id;

        const sports = await Sport.findAll({
            where: { coach_id: coachId },
            attributes: ['sport_id']
        });

        const sportIds = sports.map(s => s.sport_id);

        const schedules = await Schedule.findAll({
            where: {
                sport_id: sportIds
            },
            include: [
                { model: Sport, attributes: ['sport_name'] },
                { model: Venue, attributes: ['name'] }
            ],
            order: [['date', 'ASC'], ['start_time', 'ASC']]
        });

        res.status(200).json(schedules);
    } catch (error) {
        console.error("getMySchedules error:", error);
        res.status(500).json({ message: "Failed to fetch schedules" });
    }
}

/** Get Pending Schedule (ADMIN) */
exports.getPendingSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            where: { status: 'Pending' },
            include: [
                {
                    model: Sport,
                    attributes: ['sport_id', 'sport_name'],
                    include: [
                        {
                            model: User,
                            as: 'coach',
                            attributes: ['user_id', 'name', 'email']
                        }
                    ]
                },
                {
                    model: Venue,
                    attributes: ['venue_id', 'name']
                }
            ],
            order: [['date', 'ASC'], ['start_time', 'ASC']]
        });

        if (!schedules) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }

        res.status(200).json(schedules);
    }
    catch (error) {
        console.error('Failed to fetch pending schedules: ', error);
        res.status(500).json({ message: "Failed to fetch pending schedules" });
    }
}

/** Get approved Schedules (ADMIN) */
exports.getApprovedSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            where: { status: 'Approved' },
            include: [
                {
                    model: Sport,
                    attributes: ['sport_id', 'sport_name'],
                    include: [
                        {
                            model: User,
                            as: 'coach',
                            attributes: ['user_id', 'name', 'email']
                        }
                    ]
                },
                {
                    model: Venue,
                    attributes: ['venue_id', 'name']
                }
            ],
            order: [['date', 'ASC'], ['start_time', 'ASC']]
        });

        if (!schedules) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }

        res.status(200).json(schedules);
    }
    catch (error) {
        console.error('Failed to fetch pending schedules: ', error);
        res.status(500).json({ message: "Failed to fetch pending schedules" });
    }
}
/** Get rejected Schedules (ADMIN) */
exports.getRejectedSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            where: { status: 'Rejected' },
            include: [
                {
                    model: Sport,
                    attributes: ['sport_id', 'sport_name'],
                    include: [
                        {
                            model: User,
                            as: 'coach',
                            attributes: ['user_id', 'name', 'email']
                        }
                    ]
                },
                {
                    model: Venue,
                    attributes: ['venue_id', 'name']
                }
            ],
            order: [['date', 'ASC'], ['start_time', 'ASC']]
        });

        if (!schedules) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }

        res.status(200).json(schedules);
    }
    catch (error) {
        console.error('Failed to fetch pending schedules: ', error);
        res.status(500).json({ message: "Failed to fetch pending schedules" });
    }
}

/** Edit Schedule Request (COACH) */
exports.updateCoachSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const coachId = req.user.user_id;

        const {
            date,
            start_time,
            end_time,
            type,
            venue_id,
            sport_id
        } = req.body;

        if (end_time <= start_time) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        const owner = await Sport.findOne({ where: { sport_id: schedule.sport_id, coach_id: coachId } });
        if (!owner) return res.status(403).json({ message: 'Unauthorized access' });
        const sessionDate = date ?? (schedule.date instanceof Date ? schedule.date.toISOString().slice(0, 10) : schedule.date);
        if (!validateSession({ date: sessionDate, start_time: start_time ?? schedule.start_time, end_time: end_time ?? schedule.end_time }) || !['Practice', 'Match'].includes(type ?? schedule.type)) {
            return res.status(400).json({ message: 'Invalid session date, time or type' });
        }
        const targetSportId = sport_id ?? schedule.sport_id;

        const sport = await Sport.findOne({
            where: {
                sport_id: targetSportId,
                coach_id: coachId
            }
        });

        if (!sport) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        await schedule.update({
            sport_id: sport_id ?? schedule.sport_id,
            venue_id: venue_id ?? schedule.venue_id,
            date: date ?? schedule.date,
            start_time: start_time ?? schedule.start_time,
            end_time: end_time ?? schedule.end_time,
            type: type ?? schedule.type,
            status: 'Pending'
        });

        res.status(200).json(schedule);
    }
    catch (error) {
        console.error('Error updating schedule: ', error);
        res.status(500).json({ message: 'Failed to update schedule.' });
    }
}

/** Delete Schedule */
exports.deleteCoachSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const coachId = req.user.user_id;

        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }

        if (schedule.status === 'Approved') {
            return res.status(400).json({ message: 'Approved schedules cannot be removed' });
        }

        const sport = await Sport.findOne({
            where: {
                sport_id: schedule.sport_id,
                coach_id: coachId
            }
        });

        if (!sport) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        await schedule.destroy();

        res.status(200).json({ message: 'Schedule removed successfully' });
    }
    catch (error) {
        console.error('Error deleting schedule: ', error);
        res.status(500).json({ message: 'Failed to delete schedule.' });
    }
}

/** Approve schedule (ADMIN) */
exports.approveSchedule = async (req, res) => {
    try {
        const { id } = req.params

        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        const conflictBooking = await Booking.findOne({
            where: {
                venue_id: schedule.venue_id,
                date: schedule.date,
                status: 'Approved',
                start_time: { [Op.lt]: schedule.end_time },
                end_time: { [Op.gt]: schedule.start_time }
            }
        });

        const conflictSchedule = await Schedule.findOne({
            where: {
                venue_id: schedule.venue_id,
                date: schedule.date,
                status: 'Approved',
                schedule_id: { [Op.ne]: schedule.schedule_id },
                start_time: { [Op.lt]: schedule.end_time },
                end_time: { [Op.gt]: schedule.start_time }
            }
        });

        if (conflictBooking || conflictSchedule) {
            return res.status(400).json({ message: 'Venue already scheduled at this time.' });
        }

        schedule.status = 'Approved';
        await schedule.save();

        res.status(200).json(schedule);
    }
    catch (error) {
        console.error('Error approving schedule: ', error);
        res.status(500).json({ message: 'Failed to approve schedule.' });
    }
}

/** Reject Schedule (ADMIN) */
exports.rejectSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }

        schedule.status = 'Rejected';
        await schedule.save();

        res.status(200).json(schedule);
    }   
    catch (error) {
        console.error('Error rejecting schedule: ', error);
        res.status(500).json({message: 'Failed to reject schedule.' });
    }
}

/** Get all schedules (GUEST) */
exports.getAllApprovedSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            where: { status: 'Approved' },
            include: [
                {
                    model: Sport,
                    attributes: ['sport_id', 'sport_name']
                },
                {
                    model: Venue,
                    attributes: ['venue_id', 'name']
                }
            ],
            order: [['date', 'ASC'], ['start_time', 'ASC']]
        });
        if (!schedules) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(schedules);
    }
    catch (error) {
        console.error('Error fetching schedules: ', error);
        res.status(500).json({ message: 'Failed to load schedules' });
    }
}
