const sequelize = require('./mysql');

// Models
require('../models/mysql/Booking');
require('../models/mysql/ContactRequest');
require('../models/mysql/Media');
require('../models/mysql/Schedule');
require('../models/mysql/Sport');
require('../models/mysql/SportsRequest');
require('../models/mysql/Team');
require('../models/mysql/TeamMember');
require('../models/mysql/User');
require('../models/mysql/Venue');
require('../models/mysql/index');

async function syncModels() {
    try {
        await sequelize.sync();
        console.log("MySQL tables synced.");
    }
    catch (error) {
        console.error("MySQL sync error: ", error);
        throw error;
    }
}


module.exports = syncModels;