const Announcement = require('../models/mongo/Announcement');

/*
    @desc: Create new announcement
    @route: POST /api/announcements
*/
exports.createAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            image_path: req.body.image_path,
            link: req.body.link
        });

        const savedAnnouncement = await announcement.save();
        res.status(201).json(savedAnnouncement);
    } catch (err) {
        if (['ValidationError', 'CastError'].includes(err.name)) return res.status(400).json({ message: 'Invalid announcement data or ID' });
        console.error('Create announcement error:', err);
        res.status(500).json({ message: "Failed to create announcement" });
    }
};

/*
    @desc: Get all announcements
    @route: GET /api/announcements
*/
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement
        .find()
        .sort({ created_at: -1 });

        res.status(200).json(announcements);
    } catch (err) {
        if (['ValidationError', 'CastError'].includes(err.name)) return res.status(400).json({ message: 'Invalid announcement data or ID' });
        console.error('Get announcements error:', err);
        res.status(500).json({ message: "Failed to retrieve announcements" });
    }
};

/*
    @ desc: Get single announcement by ID
    @ route: GET /api/announcements/:id
*/
exports.getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json(announcement);
    }
    catch (error) {
        if (['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ message: 'Invalid announcement data or ID' });
        console.error('Get announcement error: ', error);
        res.status(500).json({ message: "Failed to retrieve announcement" });
    }
}

/*
    @desc: Update announcement
    @route: PUT /api/announcements/:id
*/
exports.updateAnnouncement = async (req, res) => {
    try {
        const updateAnnouncement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updateAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json(updateAnnouncement);
    }
    catch (error) {
        if (['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ message: 'Invalid announcement data or ID' });
        console.error('Update announcement error: ', error);
        res.status(500).json({ message: "Failed to update announcement" });
    }
}

/*
    @desc: Delete announcement
    @route: DELETE /api/announcements/:id
*/
exports.deleteAnnouncement = async (req, res) => {
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);

        if (!deletedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement deleted successfully" });
    }
    catch (error) {
        if (['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ message: 'Invalid announcement data or ID' });
        console.error('Delete announcement error: ', error);
        res.status(500).json({ message: "Failed to delete announcement" });
    }
}