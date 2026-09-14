const News = require('../models/mongo/News');
const Announcement = require('../models/mongo/Announcement');

const User = require('../models/mysql/User');
const Booking = require('../models/mysql/Booking');
const Team = require('../models/mysql/Team');
const Sport = require('../models/mysql/Sport');
const Schedule = require('../models/mysql/Schedule');

exports.getAdminDashboardStats = async (req, res) => {
    try {
        // MongoDB counts
        const newsCount = await News.countDocuments();
        const announcementCount = await Announcement.countDocuments();

        // MySQL counts
        const coachesCount = await User.count({
            where: { role: 'Coach' }
        });

        const pendingBookings = await Booking.count({
            where: { status: 'Pending' }
        });

        const pendingSchedules = await Schedule.count({
            where: { status: 'Pending' }
        });

        const pendingSports = await Sport.count({
            where: { status: 'Pending' }
        });

        const pendingTeams = await Team.count({
            where: { status: 'Inactive' }
        });

        res.status(200).json({
            news: newsCount,
            announcements: announcementCount,
            coaches: coachesCount,
            pendingBookings,
            pendingSchedules,
            pendingSports,
            pendingTeams
        });
    }
    catch (error) {
        console.error("Admin dashboard stats error:", error);
        res.status(500).json({ message: "Failed to load dashboard statistics" });
    }
};

exports.getCoachDashboardStats = async (req, res) => {
    try {
        // MongoDB counts
        const newsCount = await News.countDocuments();
        const announcementCount = await Announcement.countDocuments();

        // MySQL counts
        const coachesCount = await User.count({
            where: { role: 'Coach' }
        });

        const pendingBookings = await Booking.count({
            where: { status: 'Pending' }
        });

        const pendingSchedules = await Schedule.count({
            where: { status: 'Pending' }
        });

        const pendingSports = await Sport.count({
            where: { status: 'Pending' }
        });

        const pendingTeams = await Team.count({
            where: { status: 'Inactive' }
        });

        res.status(200).json({
            news: newsCount,
            announcements: announcementCount,
            coaches: coachesCount,
            pendingBookings,
            pendingSchedules,
            pendingSports,
            pendingTeams
        });
    }
    catch (error) {
        console.error("Admin dashboard stats error:", error);
        res.status(500).json({ message: "Failed to load dashboard statistics" });
    }
};
