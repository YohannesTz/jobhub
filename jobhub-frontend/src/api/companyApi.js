import api from './axios';

export const companyApi = {
  createCompany: async (data) => {
    const response = await api.post('/companies', data);
    return response.data;
  },

  getAllCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  updateCompany: async (id, data) => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  }
};

