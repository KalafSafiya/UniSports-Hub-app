const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/requireRole');
const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');

// Verify every function name matches the 'exports' in the controller exactly
router.post('/', bookingController.createBooking);
router.get('/pending', authMiddleware, requireRole('Admin'), bookingController.getPendingBookings);
router.put('/:id/status', authMiddleware, requireRole('Admin'), bookingController.updateBookingStatus);

router.get('/approved', bookingController.getAllApprovedBookings);

module.exports = router;