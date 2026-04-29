import api from "./api";

export const registerUser = async (user) => {
  return await api.post("/auth/register-user", user);
};

export const registerPharmacy = async (user) => {
  return await api.post("/auth/register-pharmacy", user);
};

export const getUser = async (username) => {
  return await api.get(`/auth/get/${username}`);
};
