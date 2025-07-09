import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Header Component
export const Header = ({ isAdmin, onLogout }) => {
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
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="text-teal-500 hover:text-teal-700 font-medium">Admin</Link>
                <button onClick={onLogout} className="text-gray-500 hover:text-gray-700">Logout</button>
              </>
            ) : (
              <Link to="/admin/login" className="text-teal-500 hover:text-teal-700 font-medium">Admin</Link>
            )}
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

// Admin Route Protection Component
export const AdminRoute = ({ children, isAdmin }) => {
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need to be logged in as admin to access this page.</p>
          <Link to="/admin/login" className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }
  return children;
};

// Admin Login Component
export const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/login', credentials);
      onLogin(response.data.token);
    } catch (error) {
      setError('Invalid credentials. Use admin/admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage jobs and organizations
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
          
          <div className="text-sm text-center text-gray-600">
            Default credentials: admin / admin123
          </div>
        </form>
      </div>
    </div>
  );
};

// Admin Dashboard Component
export const AdminDashboard = ({ jobs, organizations, onDataUpdate }) => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [showAddJob, setShowAddJob] = useState(false);
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/jobs/${jobId}`);
        onDataUpdate();
      } catch (error) {
        alert('Error deleting job');
      }
    }
  };

  const handleDeleteOrg = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await axios.delete(`/api/organizations/${orgId}`);
        onDataUpdate();
      } catch (error) {
        alert('Error deleting organization');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage jobs and organizations</p>
        </div>

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

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Jobs</h2>
              <button
                onClick={() => setShowAddJob(true)}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Add New Job
              </button>
            </div>
            
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        {job.highlighted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⭐ Highlighted
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.organization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.salary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setEditingJob(job)}
                          className="text-teal-600 hover:text-teal-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Organizations</h2>
              <button
                onClick={() => setShowAddOrg(true)}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Add New Organization
              </button>
            </div>
            
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organizations.map((org) => (
                    <tr key={org.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{org.logo}</div>
                          <div className="text-sm font-medium text-gray-900">{org.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a href={org.website} className="text-teal-600 hover:text-teal-900">
                          {org.website}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setEditingOrg(org)}
                          className="text-teal-600 hover:text-teal-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrg(org.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Job Modal */}
        {(showAddJob || editingJob) && (
          <JobModal
            job={editingJob}
            onClose={() => {
              setShowAddJob(false);
              setEditingJob(null);
            }}
            onSave={onDataUpdate}
          />
        )}

        {/* Add/Edit Organization Modal */}
        {(showAddOrg || editingOrg) && (
          <OrganizationModal
            organization={editingOrg}
            onClose={() => {
              setShowAddOrg(false);
              setEditingOrg(null);
            }}
            onSave={onDataUpdate}
          />
        )}
      </div>
    </div>
  );
};

// Job Modal Component
export const JobModal = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    organization: job?.organization || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    salary: job?.salary || '',
    description: job?.description || '',
    requirements: job?.requirements || [],
    highlighted: job?.highlighted || false,
    tags: job?.tags || [],
    organizationLogo: job?.organizationLogo || '🏢',
    organizationDescription: job?.organizationDescription || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (job) {
        await axios.put(`/api/jobs/${job.id}`, formData);
      } else {
        await axios.post('/api/jobs', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      alert('Error saving job');
    } finally {
      setLoading(false);
    }
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const handleTagsChange = (tagsString) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">
          {job ? 'Edit Job' : 'Add New Job'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization *
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Fellowship">Fellowship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., $80,000 - $120,000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Logo
              </label>
              <input
                type="text"
                placeholder="🏢"
                value={formData.organizationLogo}
                onChange={(e) => setFormData({ ...formData, organizationLogo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Description
            </label>
            <textarea
              rows="3"
              value={formData.organizationDescription}
              onChange={(e) => setFormData({ ...formData, organizationDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="text-teal-600 hover:text-teal-800"
            >
              + Add Requirement
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highlighted"
              checked={formData.highlighted}
              onChange={(e) => setFormData({ ...formData, highlighted: e.target.checked })}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="highlighted" className="ml-2 block text-sm text-gray-900">
              Highlight this job
            </label>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Job'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Organization Modal Component
export const OrganizationModal = ({ organization, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    logo: organization?.logo || '🏢',
    description: organization?.description || '',
    location: organization?.location || '',
    size: organization?.size || '',
    website: organization?.website || '',
    tags: organization?.tags || []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (organization) {
        await axios.put(`/api/organizations/${organization.id}`, formData);
      } else {
        await axios.post('/api/organizations', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      alert('Error saving organization');
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (tagsString) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">
          {organization ? 'Edit Organization' : 'Add New Organization'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <input
                type="text"
                placeholder="🏢"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Size *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 10-50 employees"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website *
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Organization'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
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