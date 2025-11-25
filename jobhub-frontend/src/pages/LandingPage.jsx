import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Building2, TrendingUp, CheckCircle, Search } from 'lucide-react';

const LandingPage = () => {
  const stats = [
    { label: 'Active Jobs', value: '10,000+' },
    { label: 'Companies', value: '5,000+' },
    { label: 'Job Seekers', value: '50,000+' },
    { label: 'Success Rate', value: '94%' },
  ];

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Smart Job Search',
      description: 'Find your perfect role with our intelligent search and filtering system.',
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'Quality Listings',
      description: 'Access verified job postings from top companies across all industries.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Direct Applications',
      description: 'Apply directly to companies with your profile and resume in seconds.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Career Growth',
      description: 'Track applications and get insights to accelerate your career journey.',
    },
  ];

  const companies = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 
    'Spotify', 'Airbnb', 'Uber', 'Tesla', 'Adobe', 'Salesforce'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                The easiest way to find your dream job
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                JobHub is a <strong>free job search platform</strong> that connects talented professionals 
                with amazing opportunities. Find your perfect role in under 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Link 
                  to="/jobs"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all duration-200 space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link 
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-full border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
                >
                  Sign Up Free
                </Link>
              </div>
              <p className="text-sm text-gray-500">No credit card required.</p>
            </div>

            {/* Right Gallery */}
            <div className="relative animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform rotate-2">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop" 
                      alt="Professional 1"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm font-semibold text-gray-900">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">Software Engineer</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform -rotate-1">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop" 
                      alt="Professional 2"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
                
                {/* Column 2 */}
                <div className="space-y-4 pt-8">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform -rotate-2">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" 
                      alt="Professional 3"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 transform rotate-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Michael Chen</p>
                        <p className="text-xs text-gray-500">Hired this week!</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Just landed my dream job! 🎉</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies & Gallery */}
      <section className="py-16 border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Companies Grid */}
          <div className="mb-16">
            <p className="text-center text-sm text-gray-500 mb-8">TRUSTED BY PROFESSIONALS AT</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-50">
              {companies.map((company, idx) => (
                <div key={idx} className="text-xl font-bold text-gray-400">
                  {company}
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">
                Join thousands of professionals
              </h3>
              <p className="text-lg text-gray-600">
                Start your journey today and discover opportunities that match your skills and ambitions.
              </p>
              <Link 
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all duration-200"
              >
                Sign Up, it's Free
              </Link>
            </div>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop" 
                  alt="Professional 1"
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop" 
                  alt="Professional 2"
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" 
                  alt="Professional 3"
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop" 
                  alt="Professional 4"
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools and resources you need for a successful job search.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center p-6">
                  <div className="inline-flex items-center justify-center h-14 w-14 bg-gray-100 rounded-lg mb-4 text-gray-900">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop" 
                alt="Job search process"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Start your job search in 3 simple steps
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Create your profile</h3>
                    <p className="text-gray-600">Sign up and build your professional profile in minutes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Search and discover</h3>
                    <p className="text-gray-600">Browse thousands of job opportunities that match your skills.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Apply with one click</h3>
                    <p className="text-gray-600">Send your application directly to employers instantly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Hiring? Find the perfect candidate
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Post your job openings and connect with talented professionals actively seeking opportunities. 
                Our platform makes hiring efficient and effective.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Post unlimited job listings</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Access to verified candidates</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Streamlined application management</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced filtering and search</span>
                </li>
              </ul>
              <Link 
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all duration-200 space-x-2"
              >
                <Building2 className="h-5 w-5" />
                <span>Post a Job</span>
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop" 
                alt="Company hiring"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to take the next step in your career?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who found their dream jobs through JobHub.
          </p>
          <Link 
            to="/jobs"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all duration-200 space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card required.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

