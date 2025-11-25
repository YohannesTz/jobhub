import { useState, useEffect } from 'react';
import { Search, Loader2, MapPin, SlidersHorizontal } from 'lucide-react';
import JobCard from '../components/JobCard';
import { jobApi } from '../api/jobApi';
import useJobStore from '../store/jobStore';

const HomePage = () => {
  const { jobs, setJobs, searchKeyword, setSearchKeyword, totalPages, currentPage } = useJobStore();
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(searchKeyword);
  const [locationInput, setLocationInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async (keyword = '', page = 0) => {
    setLoading(true);
    try {
      const response = await jobApi.searchJobs(keyword, page, 20);
      setJobs(response.data.content, response.data.totalPages, response.data.number);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(searchKeyword, currentPage);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    fetchJobs(searchInput, 0);
  };

  const handlePageChange = (page) => {
    fetchJobs(searchKeyword, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Find Your Next Opportunity
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Browse thousands of job openings from top companies
            </p>
            
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mt-8">
              <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 text-gray-900 focus:outline-none rounded-lg"
                  />
                </div>
                <div className="flex-1 relative md:border-l border-gray-200">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 text-gray-900 focus:outline-none rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Jobs Section with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{jobs.length}</span> {jobs.length === 1 ? 'job' : 'jobs'} found
                    </p>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>Filters</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                      const page = currentPage < 3 ? idx : currentPage - 2 + idx;
                      if (page >= totalPages) return null;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            page === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-80`}>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-20">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Search Tips</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-900 font-bold">•</span>
                    <p>Use keywords to search job titles and descriptions</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-900 font-bold">•</span>
                    <p>Add location to filter by geographic area</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-900 font-bold">•</span>
                    <p>Click any job card to view full details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
