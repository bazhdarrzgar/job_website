from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import json
import aiofiles
from bson import ObjectId


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Simple admin token (in production, use proper JWT authentication)
ADMIN_TOKEN = "admin-token-80000-hours"

# File paths for JSON storage (backup to MongoDB)
JOBS_FILE = ROOT_DIR / "jobs.json"
ORGANIZATIONS_FILE = ROOT_DIR / "organizations.json"

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class Job(BaseModel):
    id: Optional[str] = None
    title: str
    organization: str
    location: str
    type: str
    salary: str
    description: str
    requirements: List[str]
    posted: str = Field(default="Just posted")
    highlighted: bool = False
    tags: List[str]
    organizationLogo: str = "🏢"
    organizationDescription: str = ""

class JobCreate(BaseModel):
    title: str
    organization: str
    location: str
    type: str
    salary: str
    description: str
    requirements: List[str]
    highlighted: bool = False
    tags: List[str]
    organizationLogo: str = "🏢"
    organizationDescription: str = ""

class Organization(BaseModel):
    id: Optional[str] = None
    name: str
    logo: str = "🏢"
    description: str
    location: str
    size: str
    website: str
    jobs: int = 0
    tags: List[str]

class OrganizationCreate(BaseModel):
    name: str
    logo: str = "🏢"
    description: str
    location: str
    size: str
    website: str
    tags: List[str]

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    token: str
    message: str

# Authentication dependency
async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return "admin"

# Helper functions for JSON file operations
async def load_jobs():
    try:
        if JOBS_FILE.exists():
            async with aiofiles.open(JOBS_FILE, 'r') as f:
                content = await f.read()
                jobs_data = json.loads(content)
                return [Job(**job) for job in jobs_data]
        return []
    except Exception as e:
        logger.error(f"Error loading jobs: {e}")
        return []

async def save_jobs(jobs: List[Job]):
    try:
        jobs_data = [job.dict() for job in jobs]
        async with aiofiles.open(JOBS_FILE, 'w') as f:
            await f.write(json.dumps(jobs_data, indent=2))
    except Exception as e:
        logger.error(f"Error saving jobs: {e}")

async def load_organizations():
    try:
        if ORGANIZATIONS_FILE.exists():
            async with aiofiles.open(ORGANIZATIONS_FILE, 'r') as f:
                content = await f.read()
                orgs_data = json.loads(content)
                return [Organization(**org) for org in orgs_data]
        return []
    except Exception as e:
        logger.error(f"Error loading organizations: {e}")
        return []

async def save_organizations(organizations: List[Organization]):
    try:
        orgs_data = [org.dict() for org in organizations]
        async with aiofiles.open(ORGANIZATIONS_FILE, 'w') as f:
            await f.write(json.dumps(orgs_data, indent=2))
    except Exception as e:
        logger.error(f"Error saving organizations: {e}")

# Initialize with sample data if files don't exist
async def initialize_data():
    jobs = await load_jobs()
    organizations = await load_organizations()
    
    if not jobs:
        sample_jobs = [
            Job(
                id="1",
                title="Senior Technical Infrastructure Contractor",
                organization="FAR AI",
                location="San Francisco, CA / Remote",
                type="Contract",
                salary="$120,000 - $150,000",
                description="Help build trustworthy AI systems that are beneficial to society. Work on technical infrastructure for AI safety research.",
                requirements=["5+ years experience in software engineering", "Experience with Python, React, or similar", "Interest in AI safety"],
                posted="2 days ago",
                highlighted=True,
                tags=["AI Safety", "Technical", "Remote"],
                organizationLogo="🤖",
                organizationDescription="FAR AI aims to ensure AI systems are trustworthy and beneficial to society."
            ),
            Job(
                id="2",
                title="Director of Public Engagement",
                organization="Center for AI Safety",
                location="San Francisco, CA",
                type="Full-time",
                salary="$130,000 - $180,000",
                description="Lead public engagement initiatives to reduce high-consequence risks from AI through technical research and field-building.",
                requirements=["7+ years in public engagement or communications", "Experience with AI policy or safety", "Strong leadership skills"],
                posted="1 week ago",
                highlighted=False,
                tags=["Public Engagement", "Leadership", "AI Policy"],
                organizationLogo="🛡️",
                organizationDescription="Center for AI Safety focuses on reducing high-consequence risks from AI through technical research and field-building."
            )
        ]
        await save_jobs(sample_jobs)
    
    if not organizations:
        sample_orgs = [
            Organization(
                id="1",
                name="FAR AI",
                logo="🤖",
                description="FAR AI aims to ensure AI systems are trustworthy and beneficial to society.",
                location="San Francisco, CA",
                size="20-50 employees",
                website="https://far.ai",
                jobs=2,
                tags=["AI Safety", "Technical Research", "Machine Learning"]
            ),
            Organization(
                id="2",
                name="Center for AI Safety",
                logo="🛡️",
                description="Center for AI Safety focuses on reducing high-consequence risks from AI through technical research and field-building.",
                location="San Francisco, CA",
                size="50-100 employees",
                website="https://safe.ai",
                jobs=2,
                tags=["AI Safety", "Research", "Risk Reduction"]
            )
        ]
        await save_organizations(sample_orgs)

# Original routes
@api_router.get("/")
async def root():
    return {"message": "80000 Hours Job Board API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Admin Authentication
@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(credentials: AdminLogin):
    if credentials.username == "admin" and credentials.password == "admin123":
        return AdminResponse(token=ADMIN_TOKEN, message="Login successful")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )

# Jobs API
@api_router.get("/jobs", response_model=List[Job])
async def get_jobs():
    jobs = await load_jobs()
    return jobs

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    jobs = await load_jobs()
    for job in jobs:
        if job.id == job_id:
            return job
    raise HTTPException(status_code=404, detail="Job not found")

@api_router.post("/jobs", response_model=Job)
async def create_job(job: JobCreate, admin: str = Depends(get_current_admin)):
    jobs = await load_jobs()
    new_job = Job(**job.dict(), id=str(uuid.uuid4()))
    jobs.append(new_job)
    await save_jobs(jobs)
    return new_job

@api_router.put("/jobs/{job_id}", response_model=Job)
async def update_job(job_id: str, job: JobCreate, admin: str = Depends(get_current_admin)):
    jobs = await load_jobs()
    for i, existing_job in enumerate(jobs):
        if existing_job.id == job_id:
            updated_job = Job(**job.dict(), id=job_id)
            jobs[i] = updated_job
            await save_jobs(jobs)
            return updated_job
    raise HTTPException(status_code=404, detail="Job not found")

@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, admin: str = Depends(get_current_admin)):
    jobs = await load_jobs()
    for i, job in enumerate(jobs):
        if job.id == job_id:
            del jobs[i]
            await save_jobs(jobs)
            return {"message": "Job deleted successfully"}
    raise HTTPException(status_code=404, detail="Job not found")

# Organizations API
@api_router.get("/organizations", response_model=List[Organization])
async def get_organizations():
    organizations = await load_organizations()
    return organizations

@api_router.get("/organizations/{org_id}", response_model=Organization)
async def get_organization(org_id: str):
    organizations = await load_organizations()
    for org in organizations:
        if org.id == org_id:
            return org
    raise HTTPException(status_code=404, detail="Organization not found")

@api_router.post("/organizations", response_model=Organization)
async def create_organization(org: OrganizationCreate, admin: str = Depends(get_current_admin)):
    organizations = await load_organizations()
    new_org = Organization(**org.dict(), id=str(uuid.uuid4()))
    organizations.append(new_org)
    await save_organizations(organizations)
    return new_org

@api_router.put("/organizations/{org_id}", response_model=Organization)
async def update_organization(org_id: str, org: OrganizationCreate, admin: str = Depends(get_current_admin)):
    organizations = await load_organizations()
    for i, existing_org in enumerate(organizations):
        if existing_org.id == org_id:
            updated_org = Organization(**org.dict(), id=org_id)
            organizations[i] = updated_org
            await save_organizations(organizations)
            return updated_org
    raise HTTPException(status_code=404, detail="Organization not found")

@api_router.delete("/organizations/{org_id}")
async def delete_organization(org_id: str, admin: str = Depends(get_current_admin)):
    organizations = await load_organizations()
    for i, org in enumerate(organizations):
        if org.id == org_id:
            del organizations[i]
            await save_organizations(organizations)
            return {"message": "Organization deleted successfully"}
    raise HTTPException(status_code=404, detail="Organization not found")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await initialize_data()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
