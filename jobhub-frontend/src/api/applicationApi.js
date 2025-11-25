import api from './axios';

export const applicationApi = {
  applyToJob: async (jobId, data) => {
    const response = await api.post(`/jobs/${jobId}/apply`, data);
    return response.data;
  },

  getApplicationsForJob: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/me');
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  }
};

