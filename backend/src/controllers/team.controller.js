const Team = require('../models/mysql/Team');
const Sport = require('../models/mysql/Sport');
const TeamMember = require('../models/mysql/TeamMember');
const sequelize = require('../config/mysql');

/*
    Create Team and Members (Status: Inactive)
    @route: POST /api/teams
*/
exports.createTeam = async (req, res) => {
    try {
        const { team_name, sport_id, members } = req.body;

        if (!team_name || !sport_id) {
            return res.status(400).json({ message: "Team name and sport id are required." });
        }

        if (members !== undefined && !Array.isArray(members)) return res.status(400).json({ message: 'Members must be an array' });
        const owner = await Sport.findOne({ where: { sport_id, coach_id: req.user.user_id } });
        if (!owner) return res.status(403).json({ message: 'Unauthorized sport' });
        const team = await sequelize.transaction(async transaction => {
        const created = await Team.create({
            team_name,
            sport_id,
            status: 'Inactive' // Default status for admin review
        }, { transaction });

        if (members && members.length > 0) {
            const memberData = members.map(m => ({
                ...m,
                team_id: created.team_id
            }));
            await TeamMember.bulkCreate(memberData, { transaction, validate: true });
        }

        return created;
        });
        res.status(201).json(team);
    }
    catch (error) {
        console.error('Error creating team: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/*
    Admin: Fetch all Inactive team requests
    @route: GET /api/teams/pending
*/
exports.getPendingTeamRequests = async (req, res) => {
    try {
        const requests = await Team.findAll({
            where: { status: 'Inactive' },
            include: [
                { model: Sport, attributes: ['sport_name'] },
                { model: TeamMember }
            ]
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching team requests:', error);
        res.status(500).json({ message: 'Error fetching team requests' });
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { team_name, members, status } = req.body;

        const team = await Team.findByPk(id);
        if (!team) return res.status(404).json({ message: "Team not found" });

        // Update the Team Name and/or Status
        await team.update({
            team_name: team_name || team.team_name,
            status: status || team.status
        });

        // If members are provided, sync the team_members table
        if (members && Array.isArray(members)) {
            // 1. Remove all existing members for this team
            await TeamMember.destroy({ where: { team_id: id } });
            
            // 2. Map and insert the new/edited member list
            const memberData = members.map(m => ({
                team_id: id,
                member_name: m.member_name,
                registration_number: m.registration_number,
                role: m.role,
                faculty: m.faculty,
                year: m.year
            }));
            await TeamMember.bulkCreate(memberData);
        }

        res.status(200).json({ message: "Team updated successfully", team });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/*
    Get all teams (Active Only)
    @route: GET /api/teams
*/
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.findAll({
            include: [
                { model: Sport, attributes: ['sport_id', 'sport_name'] },
                { model: TeamMember }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(teams);
    }
    catch (error) {
        console.error('Error fetching teams: ', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

/*
    Get team by ID
    @route: GET /api/teams/:id
*/
exports.getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findByPk(id, {
            include: [
                { model: Sport, attributes: ['sport_id', 'sport_name'] },
                { model: TeamMember }
            ]
        });

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        res.status(200).json(team);
    }
    catch (error) {
        console.error('Error fetching team: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* Delete Team (Used for Rejection) 
    @route: DELETE /api/teams/:id 
*/
exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findByPk(id);
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Deleting the team will automatically delete members due to 
        // the ON DELETE CASCADE constraint in your MySQL table.
        await team.destroy();

        res.status(200).json({ message: 'Team request rejected and deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/*
    Coach request to edit a team:
        - Old team is marked as Inactive
        - New team request is created for admin approval
*/
exports.editTeamRequest = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id } = req.params;
        const { team_name, members } = req.body;

        const oldTeam = await Team.findByPk(id, { transaction });

        if (!oldTeam) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Team not found' });
        }

        const owner = await Sport.findOne({ where: { sport_id: oldTeam.sport_id, coach_id: req.user.user_id }, transaction });
        if (!owner) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Unauthorized team' });
        }
        await oldTeam.update(
            { status: 'Inactive' },
            { transaction }
        );

        const newTeam = await Team.create({
            team_name: team_name,
            sport_id: oldTeam.sport_id,
            status: 'Inactive'
        }, { transaction });

        if (Array.isArray(members) && members.length > 0) {
            const memberRows = members.map(m => ({
                team_id: newTeam.team_id,
                member_name: m.member_name,
                registration_number: m.registration_number,
                role: m.role,
                faculty: m.faculty,
                year: m.year
            }));

            await TeamMember.bulkCreate(memberRows, { transaction });
        }

        await transaction.commit();

        return res.status(201).json({
            message: 'Team edit request submitted successfully.',
            newTeamId: newTeam.team_id
        })
    }
    catch (error) {
        if (transaction && !transaction.finished) await transaction.rollback();
        console.error('Error updating team members: ', error);
        res.status(500).json({ message: 'Failed to send the update request' });
    }
}