const requireRole = require('../middlewares/requireRole');
const router = require('express').Router();
const scheduleController = require('../controllers/schedule.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/** Coach Side Routes */
// Get approved schedules for coach
router.get('/my-schedules', authMiddleware, scheduleController.getMySchedules);

// Create new schedule request
router.post('/create', authMiddleware, scheduleController.createScheduleRequest);

// Edit schedule request
router.put('/coach/:id', authMiddleware, scheduleController.updateCoachSchedule);

// Delete schedule request
router.delete('/coach/:id', authMiddleware, scheduleController.deleteCoachSchedule);

/** Admin routes */
// Get Pending Schedule 
router.get('/admin/pending', authMiddleware, requireRole('Admin'), scheduleController.getPendingSchedules)

// Get approved schedules
router.get('/admin/approved', authMiddleware, requireRole('Admin'), scheduleController.getApprovedSchedules);

// Get rejected schedules
router.get('/admin/rejected', authMiddleware, requireRole('Admin'), scheduleController.getRejectedSchedules);

// Approve a schedule
router.put('/admin/approve/:id', authMiddleware, requireRole('Admin'), scheduleController.approveSchedule);

// Reject a schedule
router.put('/admin/reject/:id', authMiddleware, requireRole('Admin'), scheduleController.rejectSchedule);

/** Guest routes */
router.get('/guest', scheduleController.getAllApprovedSchedules);

module.exports = router;