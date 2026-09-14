const requireRole = require('../middlewares/requireRole');
const router = require('express').Router();
const statsController = require('../controllers/stats.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/admin-dashboard-stats', auth, requireRole('Admin'), statsController.getAdminDashboardStats);

module.exports = router;