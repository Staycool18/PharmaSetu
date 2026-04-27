import axios from 'axios'

const API_BASE = `http://${window.location.hostname}:8083`;

export const login = (request) => {
  return axios.post(`${API_BASE}/auth/login`, request);
};