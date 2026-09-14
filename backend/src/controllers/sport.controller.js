const Sport = require('../models/mysql/Sport');
const User = require('../models/mysql/User');
const Team = require('../models/mysql/Team');
const TeamMember = require('../models/mysql/TeamMember'); // [UPDATE]: Added TeamMember import

/**
 * Coach: Request a new sport
 * @route POST /api/sports
 */
exports.createSport = async (req, res) => {
    try {
        const { sport_name, description } = req.body;
        const coach_id = req.user.user_id || req.user.id; 

        const existingSport = await Sport.findOne({ where: { sport_name }});
        if (existingSport) {
            return res.status(400).json({ message: 'This sport name already exists' });
        }

        const sport = await Sport.create({
            sport_name,
            description,
            coach_id,
            status: 'Pending' 
        });

        res.status(201).json({ message: 'Sport request submitted successfully', sport });
    } catch (error) {
        console.error('Error creating sport request:', error);
        res.status(500).json({ message: 'Failed to submit sport request' });
    }
};

/*
    Get All Sports
    @route GET /api/sports
*/
exports.getAllSports = async (req, res) => {
    try {
        const sports = await Sport.findAll();

        if (!sports) {
            return res.status(404).json({ message: "Sport not found" });
        }

        res.status(200).json(sports);
    } 
    catch (error) {
        console.error('Error fetching sports: ', error);
        res.status(500).json({ message: 'Failed to fectch sports' });
    }
}


/**
 * Admin: Get all Pending requests
 * @route GET /api/sports/pending
 */
exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await Sport.findAll({
            where: { status: 'Pending' },
            include: {
                model: User,
                as: 'coach',
                attributes: ['name', 'email'] 
            }
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Failed to fetch pending requests' });
    }
};

/*
    Admin Action: Approve with Image or Reject
    @route: PATCH /api/sports/:id/status
*/
exports.updateSportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, image } = req.body;
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ message: 'Invalid sport action' });
        }

        const sport = await Sport.findByPk(id);
        if (!sport) return res.status(404).json({ message: 'Sport not found' });

        if (action === 'approve') {
            await sport.update({ 
                status: 'Approved',
                image: image 
            });
            return res.status(200).json({ message: 'Approved' });
        } else {
            await sport.destroy();
            return res.status(200).json({ message: 'Rejected' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
    Get all Approved sports for Grid Display
    @route: GET /api/sports/approved
*/
exports.getApprovedSports = async (req, res) => {
    try {
        const sports = await Sport.findAll({
            where: { status: 'Approved' },
            include: [
                {
                    model: Team,
                    where: { status: 'Active' },
                    required: false,
                    // [UPDATE]: Added TeamMember inclusion so members are available for the Edit modal
                    include: [
                        {
                            model: TeamMember
                        }
                    ]
                }
            ]
        });
        res.status(200).json(sports);
    } catch (error) {
        console.error('Error fetching approved sports:', error); // [UPDATE]: Added logging
        res.status(500).json({ message: 'Error fetching sports' });
    }
};

/*
    Get own approved sports
    @route GET /api/saports/my-approved
*/
exports.getMyApprovedSports = async (req, res) => {
    try {
        const coach_id = req.user.user_id || req.user_id;

        const sports = await Sport.findAll({
            where: {
                coach_id,
                status: 'Approved'
            },
            include: [
                {
                    model: Team,
                    where: { status: 'Active'},
                    required: false,
                    include: [
                        {
                            model: TeamMember
                        }
                    ]
                }
            ]
        });

        res.status(200).json(sports);
    }
    catch (error) {
        console.error('Error fetching coach approved sports', error);
        res.status(500).json({ message: 'Failed to fetch coach sports' });
    }
}

/** Get approved sports with teams and team members */
exports.getApprovedSportsWithTeams = async (req, res) => {
    try {
        const sports = await Sport.findAll({
            where: { status: 'Approved' },
            attributes: ['sport_id', 'sport_name', 'image'],
            include: [
                {
                    model: Team,
                    attributes: ['team_id', 'team_name'],
                    where: { status: 'Active' },
                    required: false,
                    include: [
                        {
                            model: TeamMember,
                            attributes: [
                                'role',
                                'member_name',
                                'registration_number',
                                'faculty',
                                'year'
                            ]
                        }
                    ]
                }
            ],
            order: [['sport_name', 'ASC']]
        });

        res.status(200).json(sports);
    }
    catch (error) {
        console.error('Error fetching sports with teams: ', error);
        res.status(500).json({ message: 'Failed to load sports data' });
    }
}

/** Get approved Sports by sport id */
exports.getApprovedSportsWithTeamsById = async (req, res) => {
    try {
        const coach_id = req.user.user_id || req.user_id;

        const sports = await Sport.findAll({
            where: { 
                coach_id,
                status: 'Approved' 
            },
            attributes: ['sport_id', 'sport_name', 'image'],
            include: [
                {
                    model: Team,
                    attributes: ['team_id', 'team_name'],
                    include: [
                        {
                            model: TeamMember,
                            attributes: [
                                'role',
                                'member_name',
                                'registration_number',
                                'faculty',
                                'year'
                            ]
                        }
                    ]
                }
            ],
            order: [['sport_name', 'ASC']]
        });

        res.status(200).json(sports);
    }
    catch (error) {
        console.error('Error fetching sports with teams: ', error);
        res.status(500).json({ message: 'Failed to load sports data' });
    }
}