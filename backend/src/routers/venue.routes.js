const requireRole = require('../middlewares/requireRole');
const router = require('express').Router();
const venueController = require('../controllers/venue.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create venue
router.post('/', authMiddleware, requireRole('Admin'), venueController.createVenue);

// Get all venues
router.get('/', venueController.getAllVenues);

module.exports = router;