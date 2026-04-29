import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8083`;

export const registerUser = async (user) => {
  return await axios.post(`${API_BASE}/auth/register-user`, user);
};

export const registerPharmacy = async (user) => {
  return await axios.post(`${API_BASE}/auth/register-pharmacy`, user);
};

export const getUser = async (username) => {
  return await axios.get(`${API_BASE}/auth/get/${username}`);
};
