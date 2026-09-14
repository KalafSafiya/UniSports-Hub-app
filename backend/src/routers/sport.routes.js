const requireRole = require('../middlewares/requireRole');
const router = require('express').Router();
const sportController = require('../controllers/sport.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public: View approved sports on GuestSports page
router.get('/approved', sportController.getApprovedSportsWithTeams);

// Admin: Get all sports
router.get('/', authMiddleware, sportController.getAllSports);

// Coach: Request new sport (Protected)
router.post('/', authMiddleware, sportController.createSport);
router.get('/my-approved', authMiddleware, sportController.getMyApprovedSports);

// Admin: Review pending requests (Protected)
router.get('/pending', authMiddleware, requireRole('Admin'), sportController.getPendingRequests);

// Admin: Approve or Reject (Protected)
router.patch('/:id/status', authMiddleware, requireRole('Admin'), sportController.updateSportStatus);

// Coach: Get team members
router.get('/coach-dashboard-team', authMiddleware, sportController.getApprovedSportsWithTeamsById);

module.exports = router;
