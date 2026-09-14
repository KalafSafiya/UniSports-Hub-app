import api from './api';

const API_URL = "/news";

// Fetch all news
export const getNews = async () => {
    const response = await api.get(API_URL);
    return response.data;
}

// Fetch a single news by ID
export const getNewsById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
}

// Create a new news
export const createNews = async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
}

// Update an existing news
export const updateNews = async (id, updatedData) => {
    const response = await api.put(`${API_URL}/${id}`, updatedData);
    return response.data;
}

// Delete a news
export const deleteNews = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
}