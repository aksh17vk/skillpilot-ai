# SKILLPILOT AI

## Your AI-Powered Career Operating System

**Team Name:** Team Harnex

---

## Problem Statement

Students and early-career professionals often struggle to determine whether their current skills are sufficient for their target job roles. Most career guidance platforms focus only on resumes or job listings and do not provide a complete career-development workflow. As a result, learners find it difficult to identify skill gaps, choose the right topics to study, plan their learning schedule, and receive continuous guidance throughout their preparation journey.

---

## Solution Overview

**SkillPilot AI** is an AI-powered Career Operating System designed to help students and professionals evaluate their career readiness, identify skill gaps, assess their abilities, generate personalized learning roadmaps, and receive AI-driven career guidance.

The platform integrates resume analysis, job description analysis, skill-gap detection, personalized learning planning, assessments, PDF roadmap generation, and an AI career assistant into a single workflow. Instead of relying on multiple disconnected tools, users can manage their complete career preparation journey from one platform.

### Key Features

* AI-powered resume analysis with ATS-style insights
* Job description analysis for target roles
* Automatic skill-gap identification
* Personalized learning roadmaps with Auto and Manual modes
* Roadmap-based assessments
* Downloadable roadmap in PDF format
* Hybrid RAG + LLM AI career assistant
* JWT-based authentication
* Semantic skill normalization for improved skill matching

---

## Live Demonstration Link

The live demo is currently under preparation for deployment.

**Demo Link:** To be added after deployment
**ppt and prototype Link:** https://drive.google.com/drive/folders/1PLjglY3UpjoV_Fk-kMR1wGnjDFCCk7y6?usp=drive_link

---

## Technology Stack

### Frontend

* Next.js
* TypeScript
* Vite
* Tailwind CSS
* TanStack Router
* shadcn/ui

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose

### AI & Intelligence Layer

* Ollama
* Llama 3.2:3b
* Retrieval-Augmented Generation (RAG)
* Embeddings
* AI-based skill-gap processing

### Additional Tools

* JWT Authentication
* Multer (File Uploads)
* PDFKit (PDF Generation)
* Git & GitHub
* Postman
* MongoDB Atlas

---

## Team Members

| Name            | Role                               |
| --------------- | ---------------------------------- |
| **Aksh Tiwari** | Team Leader & Full Stack Developer |
| **Mahi Gupta**  | Frontend Developer                 |
| **Shourya**     | Frontend Developer                 |
| **Badal Singh** | UI/UX Designer                     |

---

## Project Workflow

1. User registers or logs into the platform.
2. User uploads a resume in PDF format.
3. The AI engine analyzes the resume and extracts relevant skills.
4. User provides a target job description.
5. The system analyzes the job requirements.
6. Resume skills are compared with required skills.
7. Matched and missing skills are identified.
8. The user generates a personalized learning roadmap.
9. The roadmap can be generated automatically or manually.
10. The user can generate assessments based on the roadmap.
11. The roadmap can be downloaded as a PDF.
12. The user can interact with the AI Career Assistant for career guidance.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aksh17vk/skillpilot-ai.git
cd skillpilot-ai
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

### 4. Start Ollama

Install Ollama from https://ollama.com and run:

```bash
ollama pull llama3.2:3b
ollama run llama3.2:3b
```

### 5. Run the Backend

```bash
cd backend
npm run dev
```

Backend runs at: `http://localhost:5000`

### 6. Run the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:8080`

---

## API Overview

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`

### Resume Analysis

* `POST /api/resume/upload`

### Job Analysis

* `POST /api/job/analyze`

### Skill Gap Analysis

* `POST /api/skill-gap/analyze`

### Roadmap

* `POST /api/roadmap/generate`
* `GET /api/roadmap/:id`
* `GET /api/roadmap/:id/pdf`

### Assessment

* `POST /api/assessment/generate`
* `POST /api/assessment/submit`

### AI Assistant

* `POST /api/assistant/chat`

---

## Example Test Flow

1. Register a new account.
2. Login and obtain JWT token.
3. Upload a sample resume PDF.
4. Submit a target job description.
5. Generate skill-gap report.
6. Create a learning roadmap.
7. Download roadmap PDF.
8. Start an assessment.
9. Chat with AI assistant.

---

## Project Structure

```text
skillpilot-ai/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
└── README.md
```

---

## Deployment

### Backend

* Deploy on **Render**
* Add environment variables in Render dashboard
* Connect MongoDB Atlas

### Frontend

* Deploy on **Vercel**
* Set `VITE_API_URL` to backend API URL

---

## Future Enhancements

* AI mock interviews with voice interaction
* Resume optimization suggestions
* Company-specific preparation plans
* Interview question generator
* Peer learning community
* Mobile application
* Progress analytics dashboard
* Multi-language support

---

## Achievements

* Built a complete end-to-end AI career guidance workflow.
* Implemented semantic skill matching using AI processing.
* Integrated roadmap generation with assessment creation.
* Added downloadable PDF roadmap support.
* Developed a hybrid AI assistant using RAG and LLM techniques.

---

## License

This project is developed for educational and hackathon purposes by **Team Harnex**.

---

## Contact

For queries, collaboration, or feedback:

**Aksh Tiwari**
Team Leader – Team Harnex
GitHub: https://github.com/aksh17vk
Email: [taksh9655@gmail.com](mailto:taksh9655@gmail.com)
