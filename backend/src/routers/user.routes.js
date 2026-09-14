const requireRole = require('../middlewares/requireRole');
const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post("/", authMiddleware, requireRole('Admin'), userController.createUser);
router.get("/", authMiddleware, requireRole('Admin'), userController.getAllUsers);
router.put("/:id", authMiddleware, requireRole('Admin'), userController.updateUser);
router.put("/:id/status", authMiddleware, requireRole('Admin'), userController.updateUserStatus);
router.delete("/:id", authMiddleware, requireRole('Admin'), userController.deleteUser);

module.exports = router;
