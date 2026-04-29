import api from "./api";

export const addCategory = async (category) => {
  return await api.post("/pharmacy/create", category);
};

export const getByUser = async (userid) => {
  return await api.get(`/pharmacy/by-user/${userid}`);
};

export const getById = async (id) => {
  return await api.get(`/pharmacy/${id}`);
};

export const getAll = async () => {
  return await api.get("/pharmacy/");
};
