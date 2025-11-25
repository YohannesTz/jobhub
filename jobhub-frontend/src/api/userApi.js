import api from './axios';

export const userApi = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateMe: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  getProfilePictureUploadUrl: async (fileName, contentType) => {
    const response = await api.post('/users/me/profile-picture/upload-url', {
      fileName,
      contentType
    });
    return response.data;
  },

  updateProfilePicture: async (fileUrl) => {
    const response = await api.post('/users/me/profile-picture', { fileUrl });
    return response.data;
  },

  getResumeUploadUrl: async (fileName, contentType) => {
    const response = await api.post('/users/me/resume/upload-url', {
      fileName,
      contentType
    });
    return response.data;
  },

  updateResume: async (fileUrl) => {
    const response = await api.post('/users/me/resume', { fileUrl });
    return response.data;
  }
};

