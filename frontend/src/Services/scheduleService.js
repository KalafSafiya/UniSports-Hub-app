import api from './api';

const API_URL = '/schedules'

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Get logged-in coach schedules
export const getMySchedules = async () => {
    const res = await api.get(`${API_URL}/my-schedules`, authHeader());
    return res.data;
}

// Get Pending Schedule (ADMIN)
export const getPendingSchedules = async () => {
    const res = await api.get(`${API_URL}/admin/pending`, authHeader());
    return res.data;
}

// Create schedule request
export const createSchedule = async (data) => {
    const res = await api.post(`${API_URL}/create`, data, authHeader());
    return res.data;
} 

// Edit schedule request
export const updateSchedule = async (id, updatedData) => {
    const res = await api.put(`${API_URL}/coach/${id}`, updatedData, authHeader());
    return res.data;
}

// Delete a schedule
export const deleteSchedule = async (id) => {
    const res = await api.delete(`${API_URL}/coach/${id}`, authHeader());
    return res.data;
}

// Approve Schedule (ADMIN)
export const approveSchedule = async (id) => {
    const res = await api.put(`${API_URL}/admin/approve/${id}`, {}, authHeader());
    return res.data;
}

// Reject Schedule (ADMIN)
export const rejectSchedule = async (id) => {
    const res = await api.put(`${API_URL}/admin/reject/${id}`, {}, authHeader());
    return res.data;
}

// Get approved schedules
export const getApprovedSchedules = async () => {
    const res = await api.get(`${API_URL}/admin/approved`, authHeader());
    return res.data;
}

// Get rejected schedules
export const getRejectedSchedules = async () => {
    const res = await api.get(`${API_URL}/admin/rejected`, authHeader());
    return res.data;
}

// Get all approved schedules (GUEST)
export const getAllApprovedSchedules = async () => {
    const res = await api.get(`${API_URL}/guest`, authHeader());
    return res.data;
}