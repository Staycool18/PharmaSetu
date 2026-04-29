import api from "./api";

export const login = (request) => {
  return api.post("/auth/login", request);
};
