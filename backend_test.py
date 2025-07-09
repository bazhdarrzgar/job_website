import requests
import json
import unittest
import uuid

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://162fff8a-243a-450c-86e5-79362f928002.preview.emergentagent.com/api"

class AdminDashboardTest(unittest.TestCase):
    def setUp(self):
        # Login and get admin token
        self.admin_token = self.get_admin_token()
        self.headers = {
            "Authorization": f"Bearer {self.admin_token}",
            "Content-Type": "application/json"
        }
        
        # Test data
        self.test_job = {
            "title": "Test Job Position",
            "organization": "Test Organization",
            "location": "Remote",
            "type": "Full-time",
            "salary": "$100,000 - $120,000",
            "description": "This is a test job description",
            "requirements": ["Python", "FastAPI", "Testing"],
            "highlighted": True,
            "tags": ["Test", "API", "Backend"],
            "organizationLogo": "🧪",
            "organizationDescription": "Test organization description"
        }
        
        self.test_organization = {
            "name": "Test Organization",
            "logo": "🧪",
            "description": "Test organization description",
            "location": "Remote",
            "size": "10-50 employees",
            "website": "https://testorg.com",
            "tags": ["Test", "API", "Backend"]
        }
        
        # Store created IDs for cleanup
        self.created_job_ids = []
        self.created_org_ids = []

    def tearDown(self):
        # Clean up created test data
        for job_id in self.created_job_ids:
            try:
                requests.delete(
                    f"{BACKEND_URL}/jobs/{job_id}",
                    headers=self.headers
                )
            except:
                pass
                
        for org_id in self.created_org_ids:
            try:
                requests.delete(
                    f"{BACKEND_URL}/organizations/{org_id}",
                    headers=self.headers
                )
            except:
                pass

    def get_admin_token(self):
        """Get admin authentication token"""
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        response = requests.post(
            f"{BACKEND_URL}/admin/login",
            json=login_data
        )
        self.assertEqual(response.status_code, 200, "Admin login failed")
        return response.json()["token"]

    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        response = requests.post(
            f"{BACKEND_URL}/admin/login",
            json=login_data
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("token", data)
        self.assertEqual(data["message"], "Login successful")

    def test_admin_login_failure(self):
        """Test admin login with incorrect credentials"""
        login_data = {
            "username": "admin",
            "password": "wrongpassword"
        }
        response = requests.post(
            f"{BACKEND_URL}/admin/login",
            json=login_data
        )
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertEqual(data["detail"], "Invalid credentials")

    def test_unauthorized_access(self):
        """Test error handling for unauthorized access"""
        # Try to create a job without authentication
        response = requests.post(
            f"{BACKEND_URL}/jobs",
            json=self.test_job
        )
        self.assertIn(response.status_code, [401, 403])  # Either 401 or 403 is acceptable
        
        # Try with invalid token
        invalid_headers = {
            "Authorization": "Bearer invalid-token",
            "Content-Type": "application/json"
        }
        response = requests.post(
            f"{BACKEND_URL}/jobs",
            headers=invalid_headers,
            json=self.test_job
        )
        self.assertIn(response.status_code, [401, 403])  # Either 401 or 403 is acceptable

    # Job CRUD Tests
    def test_job_crud_operations(self):
        """Test all CRUD operations for jobs"""
        # 1. Create a job
        response = requests.post(
            f"{BACKEND_URL}/jobs",
            headers=self.headers,
            json=self.test_job
        )
        self.assertEqual(response.status_code, 200)
        job_data = response.json()
        job_id = job_data["id"]
        self.created_job_ids.append(job_id)
        
        # Verify job was created with correct data
        self.assertEqual(job_data["title"], self.test_job["title"])
        self.assertEqual(job_data["organization"], self.test_job["organization"])
        
        # 2. Get all jobs and verify our job is in the list
        response = requests.get(f"{BACKEND_URL}/jobs")
        self.assertEqual(response.status_code, 200)
        jobs = response.json()
        job_ids = [job["id"] for job in jobs]
        self.assertIn(job_id, job_ids)
        
        # 3. Get specific job by ID
        response = requests.get(f"{BACKEND_URL}/jobs/{job_id}")
        self.assertEqual(response.status_code, 200)
        job_data = response.json()
        self.assertEqual(job_data["id"], job_id)
        self.assertEqual(job_data["title"], self.test_job["title"])
        
        # 4. Update job
        updated_job = self.test_job.copy()
        updated_job["title"] = "Updated Test Job"
        updated_job["salary"] = "$120,000 - $140,000"
        
        response = requests.put(
            f"{BACKEND_URL}/jobs/{job_id}",
            headers=self.headers,
            json=updated_job
        )
        self.assertEqual(response.status_code, 200)
        updated_data = response.json()
        self.assertEqual(updated_data["title"], "Updated Test Job")
        self.assertEqual(updated_data["salary"], "$120,000 - $140,000")
        
        # Verify update was persisted
        response = requests.get(f"{BACKEND_URL}/jobs/{job_id}")
        self.assertEqual(response.status_code, 200)
        job_data = response.json()
        self.assertEqual(job_data["title"], "Updated Test Job")
        
        # 5. Delete job
        response = requests.delete(
            f"{BACKEND_URL}/jobs/{job_id}",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "Job deleted successfully")
        
        # Verify job was deleted
        response = requests.get(f"{BACKEND_URL}/jobs/{job_id}")
        self.assertEqual(response.status_code, 404)
        
        # Remove from cleanup list since we already deleted it
        self.created_job_ids.remove(job_id)

    # Organization CRUD Tests
    def test_organization_crud_operations(self):
        """Test all CRUD operations for organizations"""
        # 1. Create an organization
        response = requests.post(
            f"{BACKEND_URL}/organizations",
            headers=self.headers,
            json=self.test_organization
        )
        self.assertEqual(response.status_code, 200)
        org_data = response.json()
        org_id = org_data["id"]
        self.created_org_ids.append(org_id)
        
        # Verify organization was created with correct data
        self.assertEqual(org_data["name"], self.test_organization["name"])
        self.assertEqual(org_data["logo"], self.test_organization["logo"])
        
        # 2. Get all organizations and verify our organization is in the list
        response = requests.get(f"{BACKEND_URL}/organizations")
        self.assertEqual(response.status_code, 200)
        orgs = response.json()
        org_ids = [org["id"] for org in orgs]
        self.assertIn(org_id, org_ids)
        
        # 3. Get specific organization by ID
        response = requests.get(f"{BACKEND_URL}/organizations/{org_id}")
        self.assertEqual(response.status_code, 200)
        org_data = response.json()
        self.assertEqual(org_data["id"], org_id)
        self.assertEqual(org_data["name"], self.test_organization["name"])
        
        # 4. Update organization
        updated_org = self.test_organization.copy()
        updated_org["name"] = "Updated Test Organization"
        updated_org["size"] = "50-100 employees"
        
        response = requests.put(
            f"{BACKEND_URL}/organizations/{org_id}",
            headers=self.headers,
            json=updated_org
        )
        self.assertEqual(response.status_code, 200)
        updated_data = response.json()
        self.assertEqual(updated_data["name"], "Updated Test Organization")
        self.assertEqual(updated_data["size"], "50-100 employees")
        
        # Verify update was persisted
        response = requests.get(f"{BACKEND_URL}/organizations/{org_id}")
        self.assertEqual(response.status_code, 200)
        org_data = response.json()
        self.assertEqual(org_data["name"], "Updated Test Organization")
        
        # 5. Delete organization
        response = requests.delete(
            f"{BACKEND_URL}/organizations/{org_id}",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "Organization deleted successfully")
        
        # Verify organization was deleted
        response = requests.get(f"{BACKEND_URL}/organizations/{org_id}")
        self.assertEqual(response.status_code, 404)
        
        # Remove from cleanup list since we already deleted it
        self.created_org_ids.remove(org_id)

    def test_data_validation(self):
        """Test data validation and error responses"""
        # Test with missing required fields for job
        invalid_job = {
            "title": "Invalid Job"
            # Missing other required fields
        }
        response = requests.post(
            f"{BACKEND_URL}/jobs",
            headers=self.headers,
            json=invalid_job
        )
        self.assertEqual(response.status_code, 422)  # Validation error
        
        # Test with missing required fields for organization
        invalid_org = {
            "name": "Invalid Organization"
            # Missing other required fields
        }
        response = requests.post(
            f"{BACKEND_URL}/organizations",
            headers=self.headers,
            json=invalid_org
        )
        self.assertEqual(response.status_code, 422)  # Validation error

if __name__ == "__main__":
    unittest.main()