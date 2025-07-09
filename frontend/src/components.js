import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Header Component
export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-teal-500">80000</div>
              <div className="text-2xl font-bold text-gray-900">HOURS</div>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">Career guide</span>
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">AGI careers</span>
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">Podcast</span>
            <Link to="/jobs" className="text-gray-900 hover:text-teal-500 font-medium">Job board</Link>
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">Resources ▼</span>
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">Get 1-1 advice</span>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">New releases</span>
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">All articles</span>
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">Give feedback</span>
            <span className="text-gray-500 hover:text-gray-700 cursor-not-allowed">About ▼</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Loading Spinner Component
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
  </div>
);

// Search and Filter Component
export const SearchFilters = ({ filters, setFilters }) => {
  const [alertsOpen, setAlertsOpen] = useState(false);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Search Jobs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Search Jobs</h3>
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Explore Organizations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Explore Organizations</h3>
            <p className="text-gray-600 text-sm">Browse organizations working on the world's most pressing problems</p>
          </div>

          {/* Other Opportunities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Other Opportunities</h3>
            <p className="text-gray-600 text-sm">Volunteering, internships, and other ways to contribute</p>
          </div>
        </div>

        {/* Filters and Alerts */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
          >
            🔔 Set up alerts
          </button>
          
          <select
            value={filters.salary}
            onChange={(e) => setFilters({...filters, salary: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Annual salary</option>
            <option value="under-50k">Under $50k</option>
            <option value="50k-100k">$50k - $100k</option>
            <option value="over-100k">Over $100k</option>
          </select>

          <select
            value={filters.other}
            onChange={(e) => setFilters({...filters, other: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Other filters</option>
            <option value="remote">Remote only</option>
            <option value="fulltime">Full-time only</option>
            <option value="internship">Internships</option>
          </select>

          <button
            onClick={() => setFilters({...filters, highlighted: !filters.highlighted})}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filters.highlighted 
                ? 'bg-teal-500 text-white border-teal-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Highlighted only
          </button>
        </div>

        {/* Alert Setup Modal */}
        {alertsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">Set up job alerts</h3>
              <p className="text-gray-600 mb-4">Get notified when new jobs matching your criteria are posted.</p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4"
              />
              <div className="flex gap-2">
                <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                  Set up alerts
                </button>
                <button
                  onClick={() => setAlertsOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Newsletter Signup Component
export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="bg-white border rounded-lg p-6 sticky top-4">
      <h3 className="text-lg font-medium mb-2">Receive weekly job highlights and research updates from us</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
        >
          {subscribed ? '✓ Subscribed!' : 'JOIN OUR NEWSLETTER →'}
        </button>
      </form>
    </div>
  );
};

// Job Card Component
export const JobCard = ({ job }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{job.organizationLogo}</div>
          <div>
            <h3 className="font-medium text-lg text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.organization}</p>
          </div>
        </div>
        {job.highlighted && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
            ⭐ Highlighted
          </span>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">📍</span>
          {job.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">💰</span>
          {job.salary}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">🕒</span>
          {job.posted}
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag, index) => (
          <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// Organization Card Component
export const OrganizationCard = ({ organization }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/organizations/${organization.id}`)}
      className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start space-x-3 mb-4">
        <div className="text-2xl">{organization.logo}</div>
        <div className="flex-1">
          <h3 className="font-medium text-lg text-gray-900">{organization.name}</h3>
          <p className="text-gray-600 text-sm">{organization.location}</p>
        </div>
        <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm">
          {organization.jobs} jobs
        </span>
      </div>
      
      <p className="text-gray-700 text-sm mb-4">{organization.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {organization.tags.map((tag, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// Main Job Board Component
export const JobBoard = ({ jobs, organizations, loading, filters, setFilters }) => {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-teal-500 hover:text-teal-600">Home</Link>
            <span className="text-gray-500">▶</span>
            <span className="text-gray-900">Job board</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Jobs</h1>
              <p className="text-lg text-gray-600">
                Handpicked to help you tackle the{' '}
                <span className="text-teal-500">world's most pressing problems</span> with your career.
              </p>
            </div>
            <div className="w-80 ml-8">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters filters={filters} setFilters={setFilters} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-2 border-b-2 font-medium ${
              activeTab === 'jobs' 
                ? 'border-teal-500 text-teal-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`pb-2 border-b-2 font-medium ${
              activeTab === 'organizations' 
                ? 'border-teal-500 text-teal-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Organizations ({organizations.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'jobs' ? (
              jobs.length > 0 ? (
                jobs.map(job => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No jobs found matching your criteria.</p>
                </div>
              )
            ) : (
              organizations.map(org => <OrganizationCard key={org.id} organization={org} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Job Details Component
export const JobDetails = ({ jobs }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === parseInt(id));

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Job not found</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-teal-500 hover:text-teal-600">Home</Link>
            <span className="text-gray-500">▶</span>
            <Link to="/jobs" className="text-teal-500 hover:text-teal-600">Job board</Link>
            <span className="text-gray-500">▶</span>
            <span className="text-gray-900">{job.title}</span>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-8 border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{job.organizationLogo}</div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600">{job.organization}</p>
                </div>
              </div>
              {job.highlighted && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  ⭐ Highlighted
                </span>
              )}
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <span className="mr-2">📍</span>
                {job.location}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">💰</span>
                {job.salary}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">🕒</span>
                {job.posted}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">About this role</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">About {job.organization}</h2>
              <p className="text-gray-700">{job.organizationDescription}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="flex gap-4">
                <button className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors font-medium">
                  Apply Now
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Organization Details Component
export const OrganizationDetails = ({ organizations, jobs }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const organization = organizations.find(o => o.id === parseInt(id));
  const orgJobs = jobs.filter(job => job.organization === organization?.name);

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Organization not found</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-teal-500 hover:text-teal-600">Home</Link>
            <span className="text-gray-500">▶</span>
            <Link to="/jobs" className="text-teal-500 hover:text-teal-600">Job board</Link>
            <span className="text-gray-500">▶</span>
            <span className="text-gray-900">{organization.name}</span>
          </div>
        </div>
      </div>

      {/* Organization Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-8 border-b">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{organization.logo}</div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{organization.name}</h1>
                <p className="text-xl text-gray-600 mb-4">{organization.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📍</span>
                    {organization.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">👥</span>
                    {organization.size}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">🌐</span>
                    <a href={organization.website} className="text-teal-500 hover:text-teal-600">
                      Visit website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Focus Areas</h2>
              <div className="flex flex-wrap gap-2">
                {organization.tags.map((tag, index) => (
                  <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-6">Current Openings ({orgJobs.length})</h2>
              {orgJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orgJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No current openings</p>
              )}
            </div>

            <div className="pt-6 border-t">
              <button
                onClick={() => navigate('/jobs')}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};