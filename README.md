<img width="1600" height="782" alt="WhatsApp Image 2026-08-10 at 11 26 28" src="https://github.com/user-attachments/assets/fcada71e-bcfb-483c-a92b-4d356fa9738d" /># SKILLPILOT AI

## Your AI-Powered Career Operating System

**Team Name:** Team Harnex

---
## Project Links

💻 GitHub Repository:https://github.com/aksh17vk/skillpilot-ai (Public)
🎥 Demo Video:https://drive.google.com/file/d/1B9P6WpW4p6YC3UihgQhvBzyfhxlX2Qov/view?usp=drive_link

## Problem Statement

Students and early-career professionals often find it difficult to understand whether their current skills are sufficient for their target job roles. Most career guidance platforms focus only on resumes or job listings and do not provide a complete career-development workflow. As a result, learners struggle to identify skill gaps, choose the right topics to study, plan their learning schedule, and receive continuous guidance throughout their preparation journey.

---

## Solution Overview

**SkillPilot AI** is an AI-powered Career Operating System that helps students and professionals understand their current career readiness, identify skill gaps, assess their abilities, generate personalized learning roadmaps, and receive AI-driven career guidance.

The platform combines resume analysis, job description analysis, skill-gap detection, personalized learning planning, assessments, PDF roadmap generation, and an AI career assistant into a single workflow. Instead of using multiple disconnected tools, users can manage their career preparation from one place.

### Key Features

- AI-powered resume analysis with ATS-style insights
- Job description analysis for target roles
- Automatic skill-gap identification
- Personalized learning roadmaps with Auto and Manual modes
- Roadmap-based assessments
- Downloadable roadmap in PDF format
- Hybrid RAG + LLM AI career assistant
- JWT-based authentication
- Semantic skill normalization for improved skill matching

---

## Live Demonstration Link

The live demo is currently under preparation for deployment.

**Demo Link:** To be added after deployment

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- shadcn/ui

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

### AI & Intelligence Layer

- Ollama
- Llama 3.2:3b
- Retrieval-Augmented Generation (RAG)
- Embeddings
- AI-based skill-gap processing

### Additional Tools

- JWT Authentication
- Multer (File Uploads)
- PDFKit (PDF Generation)
- Git & GitHub
- Postman
- MongoDB Atlas

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
Copy-paste this **directly into your `README.md`**:

```
## 2. Install Frontend Dependencies

```bash
cd client
npm install
````

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 4. Configure Environment Variables

Create the required `.env` files for the frontend and backend.

### Backend Configuration

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
GEMINI_API_KEY=your_gemini_api_key
```

> **Important:** Use the actual environment variable names present in your project's configuration files.

**Never commit API keys, passwords, database credentials, or other secrets to GitHub.**

---

## 5. Start the Backend

```bash
cd server
npm run dev
```

---
## 6. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```
Then open the local URL shown by Next.js, typically:

**[http://localhost:3000](http://localhost:3000)**

````

**Important:** The outer ` ```markdown ` is only for this chat. When you paste into GitHub, paste the content starting from `## 2. Install Frontend Dependencies` and **do not include the outer markdown fence**.
````
## Future Enhancements

Planned improvements include:

-  Google OAuth
-  GitHub OAuth
-  Email verification
-  Forgot / reset password
-  Redis caching
-  Docker deployment
-  RAG-based vector database
-  Semantic search
-  AI interview simulator
-  Job recommendation engine
-  
##  Conclusion

**SkillPilot AI** bridges the gap between **education and industry requirements** by combining resume intelligence, job analysis, skill-gap detection, personalized learning roadmaps, assessments, and AI mentoring into one career readiness platform.

Its modular architecture also provides a strong foundation for future integrations such as:

-  OAuth authentication
-  Docker deployment
-  Redis caching
-  Semantic search
-  RAG-based intelligent retrieval

The platform is designed to evolve into a **personalized AI-powered career companion**, helping users continuously understand their skills, identify gaps, learn relevant technologies, and become more industry-ready.

---
