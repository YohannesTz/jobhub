import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, Briefcase, Loader2, Users } from 'lucide-react';
import { companyApi } from '../../api/companyApi';
import { jobApi } from '../../api/jobApi';

const CompanyDashboardPage = () => {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, jobsRes] = await Promise.all([
          companyApi.getAllCompanies(),
          jobApi.searchJobs('', 0, 100)
        ]);
        setCompanies(companiesRes.data);
        setJobs(jobsRes.data.content);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
          <p className="text-gray-600">Manage your companies and job postings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Companies</p>
                <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Companies Section */}
        <div className="card p-6 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Companies</h2>
            <button 
              onClick={() => navigate('/company/create')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Company</span>
            </button>
          </div>

          {companies.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Building2 className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No companies yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your company profile to start posting jobs
              </p>
              <button 
                onClick={() => navigate('/company/create')}
                className="btn-primary"
              >
                Create Your First Company
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <div key={company.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {company.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      {company.website && (
                        <p className="text-xs text-gray-500 truncate">{company.website}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {company.description || 'No description'}
                  </p>
                  <button 
                    onClick={() => navigate(`/company/${company.id}/edit`)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Jobs Section */}
        <div className="card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Job Postings</h2>
            <button 
              onClick={() => navigate('/company/jobs/create')}
              disabled={companies.length === 0}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span>Post New Job</span>
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Briefcase className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No job postings yet
              </h3>
              <p className="text-gray-600 mb-6">
                {companies.length === 0 
                  ? 'Create a company first to start posting jobs'
                  : 'Start hiring by posting your first job'}
              </p>
              {companies.length > 0 && (
                <button 
                  onClick={() => navigate('/company/jobs/create')}
                  className="btn-primary"
                >
                  Post Your First Job
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.companyName} • {job.location}</p>
                    </div>
                    <span className="badge bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                    >
                      View
                    </button>
                    <span className="text-gray-300">•</span>
                    <button 
                      onClick={() => navigate(`/company/jobs/${job.id}/applicants`)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Applicants
                    </button>
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

export default CompanyDashboardPage;
