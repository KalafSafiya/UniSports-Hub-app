import api from './api';

const API_URL = '/contact';

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Create a request
export const createRequest = async (data) => {
    const res = await api.post(API_URL, data);
    return res.data;
}

// Get all Requests
export const getAllContactRequests = async () => {
    const res = await api.get(API_URL, authHeader());
    return res.data;
}

// Update request status
export const updateContactRequestStatus = async (id, status) => {
    const res = await api.put(`${API_URL}/${id}/status`, { status }, authHeader());
    return res.data;
}

export const downloadContactAttachment = async (id, filename) => {
    const response = await api.get(`${API_URL}/${id}/attachment`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
