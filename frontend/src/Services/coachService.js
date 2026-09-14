import api from './api';

const API_URL = "";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Coach details (Sports + Teams)
export const getCoachDetails = async (id) => {
    const res = await api.get(`${API_URL}/coaches/${id}/details`, authHeader());
    return res.data;
}

// List Coaches
export const getAllCoaches = async () => {
    const res = await api.get(`${API_URL}/coaches`, authHeader());
    return res.data;
}

// Update coach
export const updateCoach = async (id, updatedData) => {
    const res = await api.put(`${API_URL}/users/${id}`, updatedData, authHeader());
    return res.data;
}

// activate / deactivate
export const toggleCoachStatus = async (id, status) => {
    const res = await api.put(
        `${API_URL}/users/${id}/status`,
        { status },
        authHeader()
    );
    return res.data;
};

// Delete coach
export const deleteCoach = async (id) => {
    const res = await api.delete(`${API_URL}/users/${id}`, authHeader());
    return res.data;
}