import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import {
  Header,
  JobBoard,
  JobDetails,
  OrganizationDetails,
  LoadingSpinner,
  AdminLogin,
  AdminDashboard,
  AdminRoute
} from './components';

// Configure axios
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_BASE_URL;

// Add axios interceptor for auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [jobs, setJobs] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    salary: '',
    other: '',
    search: '',
    highlighted: false
  });

  // Check if user is logged in as admin
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  // Load jobs and organizations from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobsResponse, orgsResponse] = await Promise.all([
          axios.get('/api/jobs'),
          axios.get('/api/organizations')
        ]);
        setJobs(jobsResponse.data);
        setOrganizations(orgsResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to empty arrays if API fails
        setJobs([]);
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !job.organization.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.highlighted && !job.highlighted) {
      return false;
    }
    if (filters.salary) {
      const salaryMatch = job.salary.match(/\$(\d+),?(\d+)?/);
      if (salaryMatch) {
        const salaryNum = parseInt(salaryMatch[1] + (salaryMatch[2] || '000'));
        if (filters.salary === 'under-50k' && salaryNum >= 50000) return false;
        if (filters.salary === '50k-100k' && (salaryNum < 50000 || salaryNum > 100000)) return false;
        if (filters.salary === 'over-100k' && salaryNum <= 100000) return false;
      }
    }
    return true;
  });

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="App">
        <Header isAdmin={isAdmin} onLogout={handleAdminLogout} />
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" />} />
          <Route 
            path="/jobs" 
            element={
              <JobBoard 
                jobs={filteredJobs} 
                organizations={organizations}
                loading={loading}
                filters={filters}
                setFilters={setFilters}
              />
            } 
          />
          <Route 
            path="/jobs/:id" 
            element={<JobDetails jobs={jobs} />} 
          />
          <Route 
            path="/organizations/:id" 
            element={<OrganizationDetails organizations={organizations} jobs={jobs} />} 
          />
          <Route 
            path="/admin/login" 
            element={
              isAdmin ? 
                <Navigate to="/admin/dashboard" /> : 
                <AdminLogin onLogin={handleAdminLogin} />
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute isAdmin={isAdmin}>
                <AdminDashboard 
                  jobs={jobs} 
                  organizations={organizations} 
                  onDataUpdate={() => window.location.reload()}
                />
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;