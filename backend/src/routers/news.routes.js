const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/requireRole');
const router = require("express").Router();
const newsController = require("../controllers/news.controller");

router.post("/", authMiddleware, requireRole('Admin'), newsController.createNews);
router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);
router.put("/:id", authMiddleware, requireRole('Admin'), newsController.updateNews);
router.delete("/:id", authMiddleware, requireRole('Admin'), newsController.deleteNews);

module.exports = router;