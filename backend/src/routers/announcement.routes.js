const requireRole = require('../middlewares/requireRole');
const router = require("express").Router();
const announcementController = require("../controllers/announcement.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, requireRole('Admin'), announcementController.createAnnouncement);
router.get("/", announcementController.getAllAnnouncements);
router.get("/:id", announcementController.getAnnouncementById);
router.put("/:id", authMiddleware, requireRole('Admin'), announcementController.updateAnnouncement);
router.delete("/:id", authMiddleware, requireRole('Admin'), announcementController.deleteAnnouncement);

module.exports = router;