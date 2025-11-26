import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileMenuOpen(false);
  };

  const handleDashboard = () => {
    if (user?.role === 'USER') {
      navigate('/dashboard');
    } else if (user?.role === 'COMPANY') {
      navigate('/company/dashboard');
    } else if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    }
    setProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button - Left */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Centered Logo */}
          <div className="flex-1 flex justify-center md:justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JobHub</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleDashboard}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 hidden sm:block"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link 
                  to="/" 
                  className="block py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/jobs" 
                  className="block py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
                <button
                  onClick={() => {
                    handleDashboard();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </button>
                <Link 
                  to="/profile" 
                  className="block py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2.5 text-red-600 font-medium border-t border-gray-100 mt-2 pt-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="block py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/jobs" 
                  className="block py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
                <Link 
                  to="/login" 
                  className="block py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block mt-2 px-4 py-2.5 bg-gray-900 text-white rounded-full font-semibold text-center hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
