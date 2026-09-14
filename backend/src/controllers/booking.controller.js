const validateSession = require('../utils/validateSession');
const Booking = require('../models/mysql/Booking');
const Sport = require('../models/mysql/Sport'); // [FIX]: Added missing import
const Venue = require('../models/mysql/Venue'); // [FIX]: Added missing import
const Schedule = require('../models/mysql/Schedule');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');

exports.createBooking = async (req, res) => {
    try {
        const { 
            role, user_name, user_email, university_id,
            sport_id, team_name, venue_id, date, 
            start_time, end_time, event_name, additional_notes 
        } = req.body;

        if (!validateSession({ date, start_time, end_time }) || !venue_id || !user_name || !user_email || !['Student', 'Staff', 'Coach'].includes(role)) {
            return res.status(400).json({ message: 'Valid booking details and time interval are required' });
        }

        const newBooking = await Booking.create({
            role,
            user_name,
            email: user_email,
            university_id,
            sport_id,
            team_name, 
            venue_id,
            date,
            start_time,
            end_time,
            event_name,
            additional_notes,
            status: 'Pending'
        });

        res.status(201).json({ message: "Booking request submitted successfully", booking: newBooking });
    } catch (error) {
        console.error("Booking Submission Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getPendingBookings = async (req, res) => {
    try {
        const requests = await Booking.findAll({
            where: { status: 'Pending' },
            include: [
                { model: Sport, attributes: ['sport_name'] },
                { model: Venue, attributes: ['name'] }
            ]
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

// [FIXED]: Added Logic for Rejection Reason and Email Notifications
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid booking status' });

        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const user_email = booking.email;
        const event_name = booking.event_name;
        if (status === 'Approved') {
            const conflictBooking = await Booking.findOne({
                where: {
                    venue_id: booking.venue_id,
                    date: booking.date,
                    status: 'Approved',
                    booking_id: { [ Op.ne ]: booking.booking_id },
                    start_time: { [Op.lt]: booking.end_time },
                    end_time: { [Op.gt]: booking.start_time }
                }
            });

            const conflictSchedule = await Schedule.findOne({
                where: {
                    venue_id: booking.venue_id,
                    date: booking.date,
                    status: 'Approved',
                    start_time: { [Op.lt]: booking.end_time },
                    end_time: { [Op.gt]: booking.start_time }
                }
            });

            if (conflictBooking || conflictSchedule) {
                return res.status(400).json({ message: 'Venue already booked at this time' });
            }
        }

        await booking.update({ 
            status, 
            rejection_reason: status === 'Rejected' ? reason : null 
        });

        // 2. Automated Email logic
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS // Your 16-character App Password
            }
        });

        const isApproved = status === 'Approved';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user_email,
            subject: `Sports HUb Booking ${status}`,
            html: `
            <div style="font-family:Arial;background:#f4f6f8;padding:20px;">
                <div style="max-width:600px;margin:auto;background:white;border-radius:8px;overflow:hidden;">
                    
                    <div style="background:${isApproved ? '#16a34a' : '#dc2626'};color:white;padding:20px;text-align:center;">
                        <h2>Sports Hub Booking Update</h2>
                    </div>

                    <div style="padding:25px;color:#333;">
                        <p>Hello,</p>

                        ${
                            isApproved
                                ? `<p>Your booking for <strong>${event_name}</strong> has been 
                                   <strong style="color:#16a34a;">approved</strong>.</p>`
                                : `<p>Your booking for <strong>${event_name}</strong> has been 
                                   <strong style="color:#dc2626;">rejected</strong>.</p>`
                        }

                        ${
                            !isApproved
                                ? `<p><strong>Reason:</strong> ${reason || "Not specified"}</p>`
                                : ''
                        }

                        <div style="text-align:center;margin:30px 0;">
                            <a href="http://localhost:3000"
                               style="background:#2563eb;color:white;padding:12px 20px;
                               text-decoration:none;border-radius:5px;">
                               Open Sports Hub
                            </a>
                        </div>

                        <p>Thank you,<br/>Sports Hub Team</p>
                    </div>

                    <div style="background:#f1f5f9;padding:15px;text-align:center;font-size:12px;">
                        © ${new Date().getFullYear()} Sports Hub
                    </div>
                </div>
            </div>
            `
        };

        // This line sends the email automatically
        try {
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error('Booking notification failed:', mailError);
            return res.status(200).json({ message: 'Status updated, but email could not be sent', emailSent: false });
        }

        res.status(200).json({ message: "Status updated and email sent!" });

    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: "Error processing request" });
    }
};

/** Get all approved bookings (Past + Future) */
exports.getAllApprovedBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { status: 'Approved' },
            include: [
                {
                    model: Sport,
                    attributes: ["sport_id", "sport_name"]
                },
                {
                    model: Venue,
                    attributes: ["venue_id", "name", "location"]
                }
            ],
            order: [['date', 'DESC'], ['start_time', 'ASC']]
        });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching approved bookings: ', error);
        res.status(500).json({ message: 'Failed to load bookings' });
    }
}
