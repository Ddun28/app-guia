import api from '@/app/api/api';

export const getUsers = async (params = {}) => {
  const response = await api.get("/users", { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/users/me/profile", profileData);
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Servicios de verificación
export const verifyEmailToken = async (token) => {
  const response = await api.post("/users/verify", { token });
  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await api.post("/users/resend-verification", { email });
  return response.data;
};

export const checkEmailVerification = async (userId) => {
  const response = await api.get(`/users/${userId}/verification-status`);
  return response.data;
};