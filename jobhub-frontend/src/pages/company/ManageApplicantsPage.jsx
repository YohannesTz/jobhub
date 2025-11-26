import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Calendar, FileText, Loader2, Users } from 'lucide-react';
import { applicationApi } from '../../api/applicationApi';
import { jobApi } from '../../api/jobApi';

const ManageApplicantsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          jobApi.getJobById(jobId),
          applicationApi.getApplicationsForJob(jobId)
        ]);
        setJob(jobRes.data);
        setApplications(appsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
        <Loader2 className="h-12 w-12 text-gray-900 animate-spin" />
        <p className="text-gray-600">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card p-6 mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job?.title}</h1>
          <p className="text-gray-600">
            {job?.companyName} • {job?.location}
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span className="font-semibold">{applications.length}</span>
              <span className="ml-1">Applicant{applications.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-4 animate-slide-up">
          {applications.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-600">
                Candidates will appear here when they apply for this position
              </p>
            </div>
          ) : (
            applications.map((application) => (
              <div key={application.id} className="card p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-xl font-semibold">
                      {application.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {application.userName}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>{application.userEmail}</span>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-green-100 text-green-700">
                    New
                  </span>
                </div>

                <div className="mb-4 flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>

                {application.message && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">Cover Letter:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {application.message}
                    </p>
                  </div>
                )}

                {application.resumeUrl && (
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Resume</span>
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageApplicantsPage;
