const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/requireRole');
const router = require('express').Router();
const contactRequestController = require('../controllers/contactRequest.controller');
const upload = require('../middlewares/upload');

/** Guests */
router.post('/', upload.single('attachment'), contactRequestController.createContactRequest);

/** Admin routes */
router.get('/', authMiddleware, requireRole('Admin'), contactRequestController.getAllContactRequests);
router.put('/:id/status', authMiddleware, requireRole('Admin'), contactRequestController.updateRequestStatus);
router.get('/:id/attachment', authMiddleware, requireRole('Admin'), contactRequestController.viewAttachment);

module.exports = router;