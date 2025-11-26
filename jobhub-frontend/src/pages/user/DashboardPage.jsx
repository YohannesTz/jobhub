import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, Loader2, FileText, Search } from 'lucide-react';
import { applicationApi } from '../../api/applicationApi';

const DashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationApi.getMyApplications();
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
        <Loader2 className="h-12 w-12 text-gray-900 animate-spin" />
        <p className="text-gray-600">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Track your job applications and career progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-gray-900" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => {
                    const appliedDate = new Date(app.appliedAt);
                    const now = new Date();
                    return appliedDate.getMonth() === now.getMonth() && 
                           appliedDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              My Applications ({applications.length})
            </h2>
            <button 
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Browse Jobs
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start applying to jobs and track your progress here
              </p>
              <button 
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Find Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  onClick={() => navigate(`/jobs/${application.jobId}`)}
                  className="p-5 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-400 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                          {application.jobTitle}
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
                      </div>

                      {application.message && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {application.message}
                        </p>
                      )}
                    </div>

                    <span className="badge bg-gray-200 text-gray-800 ml-4">
                      Submitted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
