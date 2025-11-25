import { MapPin, Building2, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`);
  };

  // Generate a color based on company name for consistent logo backgrounds
  const getCompanyColor = (name) => {
    const colors = [
      'bg-gray-800',
      'bg-gray-700', 
      'bg-gray-900',
      'bg-slate-700',
      'bg-zinc-700',
      'bg-neutral-800'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Company Logo */}
          <div className={`h-12 w-12 ${getCompanyColor(job.companyName)} rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
            {job.companyName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 space-x-2">
              <Building2 className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium truncate">{job.companyName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {job.description}
      </p>

      {/* Details */}
      <div className="flex items-center text-sm text-gray-600 mb-4 space-x-3">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <>
            <span className="text-gray-400">•</span>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold">${job.salary.toLocaleString()}/yr</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{new Date(job.postedAt).toLocaleDateString()}</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
