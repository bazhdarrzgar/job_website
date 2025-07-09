import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import {
  Header,
  JobBoard,
  JobDetails,
  OrganizationDetails,
  LoadingSpinner
} from './components';

// Mock data for jobs
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Technical Infrastructure Contractor",
    organization: "FAR AI",
    location: "San Francisco, CA / Remote",
    type: "Contract",
    salary: "$120,000 - $150,000",
    description: "Help build trustworthy AI systems that are beneficial to society. Work on technical infrastructure for AI safety research.",
    requirements: ["5+ years experience in software engineering", "Experience with Python, React, or similar", "Interest in AI safety"],
    posted: "2 days ago",
    highlighted: true,
    tags: ["AI Safety", "Technical", "Remote"],
    organizationLogo: "🤖",
    organizationDescription: "FAR AI aims to ensure AI systems are trustworthy and beneficial to society."
  },
  {
    id: 2,
    title: "Director of Public Engagement",
    organization: "Center for AI Safety",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130,000 - $180,000",
    description: "Lead public engagement initiatives to reduce high-consequence risks from AI through technical research and field-building.",
    requirements: ["7+ years in public engagement or communications", "Experience with AI policy or safety", "Strong leadership skills"],
    posted: "1 week ago",
    highlighted: false,
    tags: ["Public Engagement", "Leadership", "AI Policy"],
    organizationLogo: "🛡️",
    organizationDescription: "Center for AI Safety focuses on reducing high-consequence risks from AI through technical research and field-building."
  },
  {
    id: 3,
    title: "Policy Researcher",
    organization: "AI Futures Project",
    location: "Washington, DC / Remote",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    description: "Research and forecast the future of AI policy and governance. Work on policy recommendations for AI safety.",
    requirements: ["PhD in relevant field or equivalent experience", "Experience in policy research", "Interest in AI governance"],
    posted: "3 days ago",
    highlighted: true,
    tags: ["Policy", "Research", "AI Governance"],
    organizationLogo: "📊",
    organizationDescription: "AI Futures Project is a research group forecasting the future of AI."
  },
  {
    id: 4,
    title: "Research Engineer Intern",
    organization: "Center for AI Safety",
    location: "San Francisco, CA",
    type: "Internship",
    salary: "$6,000 - $8,000/month",
    description: "Support technical research on AI safety and alignment. Great opportunity for students interested in AI safety research.",
    requirements: ["Currently enrolled in CS, ML, or related program", "Experience with Python and ML frameworks", "Interest in AI safety"],
    posted: "1 day ago",
    highlighted: false,
    tags: ["Research", "Internship", "AI Safety"],
    organizationLogo: "🛡️",
    organizationDescription: "Center for AI Safety focuses on reducing high-consequence risks from AI through technical research and field-building."
  },
  {
    id: 5,
    title: "Technical Event Operations Specialist",
    organization: "FAR AI",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    description: "Organize and manage technical events, workshops, and conferences related to AI safety and research.",
    requirements: ["3+ years event management experience", "Technical background preferred", "Excellent organizational skills"],
    posted: "5 days ago",
    highlighted: false,
    tags: ["Event Management", "Operations", "Technical"],
    organizationLogo: "🤖",
    organizationDescription: "FAR AI aims to ensure AI systems are trustworthy and beneficial to society."
  },
  {
    id: 6,
    title: "Fellowship Position",
    organization: "Safe AI Forum",
    location: "Multiple locations",
    type: "Fellowship",
    salary: "$50,000 - $70,000",
    description: "Foster responsible governance to reduce catastrophic risks through collaboration among global actors in AI safety.",
    requirements: ["Graduate degree in relevant field", "Experience in governance or policy", "Strong communication skills"],
    posted: "1 week ago",
    highlighted: true,
    tags: ["Fellowship", "Governance", "AI Safety"],
    organizationLogo: "🌐",
    organizationDescription: "Safe AI Forum seeks to foster responsible governance to reduce catastrophic risks through collaboration among global actors."
  }
];

// Mock data for organizations
const MOCK_ORGANIZATIONS = [
  {
    id: 1,
    name: "FAR AI",
    logo: "🤖",
    description: "FAR AI aims to ensure AI systems are trustworthy and beneficial to society.",
    location: "San Francisco, CA",
    size: "20-50 employees",
    website: "https://far.ai",
    jobs: 2,
    tags: ["AI Safety", "Technical Research", "Machine Learning"]
  },
  {
    id: 2,
    name: "Center for AI Safety",
    logo: "🛡️",
    description: "Center for AI Safety focuses on reducing high-consequence risks from AI through technical research and field-building.",
    location: "San Francisco, CA",
    size: "50-100 employees",
    website: "https://safe.ai",
    jobs: 2,
    tags: ["AI Safety", "Research", "Risk Reduction"]
  },
  {
    id: 3,
    name: "AI Futures Project",
    logo: "📊",
    description: "AI Futures Project is a research group forecasting the future of AI.",
    location: "Washington, DC",
    size: "10-20 employees",
    website: "https://aifutures.org",
    jobs: 1,
    tags: ["AI Research", "Policy", "Forecasting"]
  },
  {
    id: 4,
    name: "Safe AI Forum",
    logo: "🌐",
    description: "Safe AI Forum seeks to foster responsible governance to reduce catastrophic risks through collaboration among global actors.",
    location: "Multiple locations",
    size: "30-50 employees",
    website: "https://safeai.forum",
    jobs: 1,
    tags: ["Governance", "AI Safety", "International Cooperation"]
  }
];

function App() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [organizations, setOrganizations] = useState(MOCK_ORGANIZATIONS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    salary: '',
    other: '',
    search: '',
    highlighted: false
  });

  // Remove the useEffect that was causing issues
  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     try {
  //       await new Promise(resolve => setTimeout(resolve, 1500));
  //       setJobs(MOCK_JOBS);
  //       setOrganizations(MOCK_ORGANIZATIONS);
  //     } catch (error) {
  //       console.error('Error loading data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadData();
  // }, []);

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

  return (
    <Router>
      <div className="App">
        <Header />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;