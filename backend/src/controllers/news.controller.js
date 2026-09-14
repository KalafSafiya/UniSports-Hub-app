const News = require('../models/mongo/News');

/*
    @desc: Create new news
    @route: POST /api/news
*/
exports.createNews = async (req, res) => {
    try {
        const news = new News({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            image_path: req.body.image_path,
            link: req.body.link
        });

        const savedNews = await news.save();
        res.status(201).json(savedNews);
    }
    catch (error) {
        if (['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ message: 'Invalid news data or ID' });
        console.error('Create news error: ', error);
        res.status(500).json({ message: "Failed to create news" });
    }
}

/*
    @desc: Get all news
    @route: GET /api/news
*/
exports.getAllNews = async (req, res) => {
    try {
        const newsList = await News.find().sort({ created_at: -1 });
        res.status(200).json(newsList);
    }
    catch (error) {
        if (['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ message: 'Invalid news data or ID' });
        console.error('Get news error: ', error);
        res.status(500).json({ message: "Failed to retrieve news" });
    }
}

/*
    @ desc: Get single news by ID
    @ route: GET /api/news/:id
*/
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }

        res.status(200).json(news);
    }
    catch (error) {
        if (['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ message: 'Invalid news data or ID' });
        console.error('Get news error: ', error);
        res.status(500).json({ message: "Failed to retrieve news" });
    }
}

/*
    @ desc: Update news by ID
    @ route: PUT /api/news/:id
*/
exports.updateNews = async (req, res) => {
    try {
        const updateNews = await News.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updateNews) {
            return res.status(404).json({ message: "News not found" });
        }

        res.status(200).json(updateNews);
    }
    catch (error) {
        if (['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ message: 'Invalid news data or ID' });
        console.error('Update news error: ', error);
        res.status(500).json({ message: "Failed to update news" });
    }
}

/*
    @ desc: Delete news by ID
    @ route: DELETE /api/news/:id
*/
exports.deleteNews = async (req, res) => {
    try {
        const deleteNews = await News.findByIdAndDelete(req.params.id);

        if (!deleteNews) {
            res.status(404).json({ message: "News not found" });
        }

        res.status(200).json({ message: "News deleted successfully"});
    }
    catch (error) {
        if (['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ message: 'Invalid news data or ID' });
        console.error('Delete news errorL ', error);
        res.status(500).json({ message: "Failed to delete news" });
    }
}