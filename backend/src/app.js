const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
// News and Announcement Routes -->
app.use("/api/announcements", require("./routers/announcement.routes"));
app.use("/api/news", require("./routers/news.routes"))

// User Routes -->
app.use("/api/auth", require("./routers/auth.routes"));
app.use("/api/users", require("./routers/user.routes"));

// Sport Routes -->
app.use("/api/sports", require("./routers/sport.routes"));

// Team Router -->
app.use("/api/teams", require('./routers/team.routes'));

// Team Member Router -->
app.use("/api/team-members", require('./routers/teamMember.routes'));

// Coach
app.use("/api/coaches", require('./routers/coach.routes'));

// Schedules
app.use("/api/schedules", require('./routers/schedule.routes'));

// Venues
app.use("/api/venues", require('./routers/venue.routes'));

// Bookings
app.use("/api/bookings", require('./routers/booking.routes'));

// Contact Request
app.use('/api/contact', require('./routers/contactRequest.routes'));

// Uploads
// Contact attachments are served only through the authenticated contact route.

// Stats
app.use('/api/stats', require('./routers/stats.routes'));

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : (error.status === 400 || error.name === 'MulterError' ? 400 : 500);
    res.status(status).json({ message: status === 413 ? 'Attachment exceeds 10 MB' : status === 400 ? 'Invalid request' : 'Internal Server Error' });
});
module.exports = app;
