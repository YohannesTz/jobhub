import api from './axios';

export const jobApi = {
  createJob: async (data) => {
    const response = await api.post('/jobs', data);
    return response.data;
  },

  searchJobs: async (keyword = '', page = 0, size = 20) => {
    const response = await api.get('/jobs', {
      params: { keyword, page, size }
    });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  updateJob: async (id, data) => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  }
};

