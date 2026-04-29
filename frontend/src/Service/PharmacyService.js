import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8083`;

export const addCategory = async (category) => {
  return await axios.post(`${API_BASE}/pharmacy/create`, category);
};

export const getByUser = async (userid) => {
  return await axios.get(`${API_BASE}/pharmacy/by-user/${userid}`);
};

export const getById = async (id) => {
  return await axios.get(`${API_BASE}/pharmacy/${id}`);
};

export const getAll = async () => {
  return await axios.get(`${API_BASE}/pharmacy/`);
};
