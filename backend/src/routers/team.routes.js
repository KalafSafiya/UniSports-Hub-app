const requireRole = require('../middlewares/requireRole');
const router = require('express').Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Specific route for pending requests
router.get('/pending', authMiddleware, requireRole('Admin'), teamController.getPendingTeamRequests);

// Standard CRUD routes
router.get('/', teamController.getAllTeams);
router.post('/', authMiddleware, teamController.createTeam);
router.get('/:id', teamController.getTeamById);
router.put('/:id', authMiddleware, requireRole('Admin'), teamController.updateTeam);

// [FIX]: Ensure this matches the exported function name exactly
router.delete('/:id', authMiddleware, requireRole('Admin'), teamController.deleteTeam);

// Coach edits a team
router.put('/edit-request/:id', authMiddleware, teamController.editTeamRequest);

module.exports = router;
