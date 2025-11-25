import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Building2, DollarSign, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { jobApi } from '../api/jobApi';
import useAuthStore from '../store/authStore';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobApi.getJobById(id);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Jobs
        </button>
      </div>
    );
  }

  const canApply = isAuthenticated && user?.role === 'USER';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to jobs</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{job.title}</h1>
                <p className="text-xl text-gray-600 font-medium">{job.companyName}</p>
              </div>
              {canApply && (
                <button
                  onClick={handleApply}
                  className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200"
                >
                  Apply Now
                </button>
              )}
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200"
                >
                  Login to Apply
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{job.location}</span>
              </div>

              {job.salary && (
                <div className="flex items-center space-x-2 text-gray-700">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="font-medium">${job.salary.toLocaleString()} / year</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-gray-700">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Posted {new Date(job.postedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                  {job.requirements}
                </p>
              </div>
            )}
          </div>

          {/* Apply CTA */}
          {canApply && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleApply}
                className="w-full px-6 py-3.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200"
              >
                Apply for this Position
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
