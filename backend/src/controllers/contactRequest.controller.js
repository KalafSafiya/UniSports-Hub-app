const ContactRequest = require('../models/mysql/ContactRequest');
const path = require('path');
const fs = require('fs');

/** Create a request (GUEST) */
exports.createContactRequest = async (req, res) => {
    try {
        const { name, email, role, universityId, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        const attachmentPath = req.file ? req.file.filename : null;

        const newRequest = await ContactRequest.create({
            name,
            email,
            role,
            university_id: role === 'Student' ? universityId : null,
            subject,
            message,
            attachment: attachmentPath
        });

        res.status(201).json(newRequest);
    }
    catch (error) {
        console.error('Contact request error: ', error);
        res.status(500).json({ message: 'Failed to create a request' });
    }
}

/** Get all contact requests (ADMIN) */
exports.getAllContactRequests = async (req, res) => {
    try {
        const requests = await ContactRequest.findAll({
            order: [['created_at', 'DESC']]
        });

        if (!requests) {
            return res.status(404).json({ message: 'Contact request not found' });
        }

        res.status(200).json(requests);
    }
    catch (error) {
        console.error('Error fetching contact requests: ', error);
        res.status(500).json({ message: 'Failed to load contact requests.' });
    }
}

/** Mark request as Read / Resolved (Used by "Marked as Replied" button) */
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const request = await ContactRequest.findByPk(id);
        if (!request) {
            return res.status(404).json({ message: 'Contact request not found' });
        }

        if (status !== undefined && !['Pending', 'Read', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid contact status' });
        }
        request.status = status || 'Read';
        await request.save();

        res.status(200).json(request);
    }
    catch (error) {
        console.error('Error updating request status: ', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
}

exports.viewAttachment = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await ContactRequest.findByPk(id);
        if (!request || !request.attachment) {
            return res.status(404).json({ message: 'Attachment not found'})
        }

        const filePath = path.join(
            __dirname, '../../uploads/contact', request.attachment
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File does not exist on Server' });
        }

        res.sendFile(filePath);
    } 
    catch (error) {
        console.error('Error loading attachment: ', error);
        res.status(500).json({ message: 'Failed to load attachment' });
    }
}