import { useState, useEffect } from 'react';
import { Users, Briefcase, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { jobApi } from '../../api/jobApi';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: '', name: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, jobsRes] = await Promise.all([
        adminApi.getAllUsers(),
        jobApi.searchJobs('', 0, 100)
      ]);
      setUsers(usersRes.data);
      setJobs(jobsRes.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (type, id, name) => {
    setDeleteModal({ open: true, type, id, name });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      if (deleteModal.type === 'user') {
        await adminApi.deleteUser(deleteModal.id);
      } else {
        await adminApi.deleteJob(deleteModal.id);
      }
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, type: '', id: '', name: '' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
        <Loader2 className="h-12 w-12 text-gray-900 animate-spin" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and job postings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-900" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card overflow-hidden animate-slide-up">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium transition-colors duration-200 ${
                  activeTab === 'users'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-1 border-b-2 font-medium transition-colors duration-200 ${
                  activeTab === 'jobs'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Jobs ({jobs.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'users' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Joined</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`badge ${
                            user.role === 'ADMIN' ? 'bg-gray-300 text-gray-900' :
                            user.role === 'COMPANY' ? 'bg-gray-200 text-gray-800' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteClick('user', user.id, user.name)}
                            disabled={user.role === 'ADMIN'}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Posted</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">{job.title}</td>
                        <td className="py-4 px-4 text-gray-600">{job.companyName}</td>
                        <td className="py-4 px-4 text-gray-600">{job.location}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(job.postedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteClick('job', job.id, job.title)}
                            className="text-red-600 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="card p-6 max-w-md mx-4 animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteModal.name}</span>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteModal({ open: false, type: '', id: '', name: '' })}
                disabled={deleting}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {deleting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
