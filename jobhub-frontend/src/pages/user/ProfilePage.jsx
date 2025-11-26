import { useState } from 'react';
import { User, Mail, Upload, FileText, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { uploadToS3 } from '../../utils/uploadToS3';
import useAuthStore from '../../store/authStore';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await userApi.updateMe(formData);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      let urlResponse, updateResponse;
      
      if (type === 'profile') {
        urlResponse = await userApi.getProfilePictureUploadUrl(file.name, file.type);
        await uploadToS3(urlResponse.data.uploadUrl, file);
        updateResponse = await userApi.updateProfilePicture(urlResponse.data.fileUrl);
      } else {
        urlResponse = await userApi.getResumeUploadUrl(file.name, file.type);
        await uploadToS3(urlResponse.data.uploadUrl, file);
        updateResponse = await userApi.updateResume(urlResponse.data.fileUrl);
      }

      updateUser(updateResponse.data);
      setMessage({ 
        type: 'success', 
        text: type === 'profile' ? 'Profile picture updated!' : 'Resume updated!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload file' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and documents</p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="card p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-3xl font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <label className="btn-outline cursor-pointer inline-flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profile')}
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (max 10MB)</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-start space-x-3 animate-slide-up ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </span>
            </div>
          )}

          {/* Personal Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="role"
                    type="text"
                    value={user?.role}
                    disabled
                    className="input-field pl-10 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </form>
          </div>

          {/* Resume Section */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume</h2>
            
            {user?.resumeUrl && (
              <div className="mb-4 p-4 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-gray-900" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Resume</p>
                    <p className="text-xs text-gray-600">Uploaded resume</p>
                  </div>
                </div>
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-sm"
                >
                  View
                </a>
              </div>
            )}

            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-900 transition-colors duration-200 cursor-pointer">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'resume')}
                  disabled={uploading}
                />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
