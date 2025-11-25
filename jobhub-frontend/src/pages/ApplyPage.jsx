import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { applicationApi } from '../api/applicationApi';
import { userApi } from '../api/userApi';
import { uploadToS3 } from '../utils/uploadToS3';
import useAuthStore from '../store/authStore';

const ApplyPage = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    message: '',
    useStoredResume: true,
    resumeUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setFormData({ ...formData, useStoredResume: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let resumeUrl = formData.resumeUrl;

      if (!formData.useStoredResume && selectedFile) {
        const urlResponse = await userApi.getResumeUploadUrl(
          selectedFile.name,
          selectedFile.type
        );
        
        await uploadToS3(urlResponse.data.uploadUrl, selectedFile);
        resumeUrl = urlResponse.data.fileUrl;
      }

      await applicationApi.applyToJob(jobId, {
        message: formData.message,
        useStoredResume: formData.useStoredResume,
        resumeUrl: formData.useStoredResume ? undefined : resumeUrl
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gray-900 rounded-lg flex items-center justify-center">
              <Send className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Apply for this Job</h1>
          <p className="text-gray-600 text-lg">Submit your application and stand out from the crowd</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-slide-up">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3 animate-slide-up">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">
                Application submitted successfully! Redirecting to dashboard...
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Letter / Message
                <span className="text-gray-500 font-normal"> (Optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell the employer why you're a great fit for this role..."
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Resume
              </label>

              {user?.resumeUrl && (
                <div className="mb-4">
                  <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                    <input
                      type="radio"
                      checked={formData.useStoredResume}
                      onChange={() => setFormData({ ...formData, useStoredResume: true })}
                      className="h-4 w-4 text-blue-600"
                    />
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 font-medium">Use stored resume</span>
                    </div>
                  </label>
                </div>
              )}

              <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  checked={!formData.useStoredResume}
                  onChange={() => setFormData({ ...formData, useStoredResume: false })}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700 font-medium">Upload new resume</span>
                </div>
              </label>

              {!formData.useStoredResume && (
                <div className="mt-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-900 transition-colors duration-200 cursor-pointer">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                  {selectedFile && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-blue-900 font-medium">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
