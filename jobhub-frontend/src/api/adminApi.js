import api from './axios';

export const adminApi = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  }
};

