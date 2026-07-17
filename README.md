# 🚀 Yukti AI

> **AI-Powered Resume Builder & ATS Resume Optimizer**

Yukti AI is an intelligent resume optimization platform that helps job seekers tailor their resumes for specific job descriptions using Artificial Intelligence. It analyzes both the candidate's resume and the target job description, provides an estimated ATS compatibility score, highlights skill gaps, and generates an optimized, truthful resume without inventing experience or skills.

> **"Optimize your resume. Stay truthful. Get interview-ready."**

---

# 🌟 Overview

Applying for jobs often requires customizing a resume for every position. Most candidates either spend hours manually editing their resumes or use AI tools that may generate misleading or fabricated information.

Yukti AI solves this problem by:

* 📄 Parsing existing resumes (PDF/DOCX)
* 💼 Analyzing job descriptions
* 🤖 Optimizing resumes using Google Gemini AI
* 📊 Calculating an estimated ATS compatibility score
* 🔍 Detecting missing skills and keyword gaps
* ✅ Ensuring AI never adds unsupported claims
* 📥 Generating professional resumes in multiple templates

---

# 🎯 Vision

To build an ethical AI-powered career assistant that helps candidates create truthful, ATS-friendly, and professional resumes while increasing their chances of getting shortlisted.

---

# ✨ Core Features

## 👤 Authentication

* User Registration
* Login
* JWT Authentication
* Password Encryption (BCrypt)
* Profile Management

---

## 📄 Resume Upload

Supported formats:

* PDF
* DOCX

Features:

* Upload Resume
* Secure Cloudinary Storage
* Resume History
* Version Tracking

---

## 📑 Resume Parser

Automatically extracts:

* Personal Information
* Professional Summary
* Skills
* Experience
* Projects
* Education
* Certifications
* Achievements
* Languages
* Social Links

Converts the uploaded resume into structured JSON for AI processing.

---

## 💼 Job Description Parser

Extracts:

* Required Skills
* Preferred Skills
* Responsibilities
* Technologies
* Keywords
* Experience Requirements
* Education Requirements
* Soft Skills

---

## 🧠 Matching Engine

Compares:

Resume JSON

↓

Job Description JSON

Performs:

* Keyword Matching
* Semantic Matching
* Responsibility Matching
* Technology Matching

Displays:

* Matched Skills
* Missing Skills
* Strengths
* Weaknesses
* Recommendations

---

## 📊 ATS Compatibility Score

Yukti AI calculates an **estimated ATS compatibility score** based on multiple factors.

### Score Components

* Skills Match
* Experience Relevance
* Project Relevance
* Responsibility Match
* Education Match
* Resume Formatting

> **Note:** This is Yukti AI's own estimated compatibility score and is **not** an official score from any employer's Applicant Tracking System (ATS).

---

## 🤖 AI Resume Optimization

Powered by **Google Gemini AI**

Improves:

* Professional Summary
* Experience Bullet Points
* Project Descriptions
* Grammar
* Readability
* Professional Tone
* ATS Compatibility

### Ethical AI Rules

Yukti AI **never**:

* Adds fake skills
* Creates fake experience
* Invents projects
* Adds fake companies
* Generates false certifications
* Fabricates achievements

---

## 🛡 AI Validation Layer

Every AI-generated suggestion is validated against the original resume.

If the AI suggests a skill not present in the original resume, Yukti AI asks for user confirmation before adding it.

Example:

**Job Description**

* Java
* Spring Boot
* Docker

**Resume**

* Java
* Spring Boot

Result:

```text
Missing Skill

Docker

Reason

The Job Description requires Docker, but your resume does not mention any Docker experience.

Recommendation

If you have worked with Docker but forgot to mention it,
please add a relevant project or work experience.

Otherwise, do not add Docker just to improve the ATS score.
```

This ensures the optimized resume remains truthful and interview-ready.

---

## 📈 Resume Analysis Report

Displays:

* Overall ATS Match
* Matched Skills
* Missing Skills
* Missing Technologies
* Resume Strengths
* Improvement Suggestions
* AI Recommendations
* Before vs After Comparison

---

## 📄 Resume Templates

Included in Version 1:

* ATS Friendly
* Modern
* Professional
* Minimal
* Executive

Users can preview and download resumes in different layouts while keeping the same content.

---

## 📥 Export Options

Generate and download:

* PDF
* DOCX

---

## 📚 Resume Version History

Maintain multiple optimized versions for different job roles.

Example:

```
Master Resume

├── Java Backend Developer
├── Spring Boot Developer
├── Full Stack Developer
├── Software Engineer
```

---

# 🛠 Technology Stack

## Frontend

* React.js
* TypeScript
* Tailwind CSS
* Material UI
* React Router
* Axios
* React Hook Form
* React Query
* Framer Motion

---

## Backend

* Java 21
* Spring Boot 3.x
* Spring Security
* Spring Data JPA
* Hibernate
* Maven

---

## Database

* PostgreSQL

---

## AI

* Google Gemini API

---

## File Processing

* Apache PDFBox
* Apache POI
* OpenPDF

---

## Cloud Storage

* Cloudinary

---

## Deployment

* Docker

Future:

* Kubernetes

---

# 🏗 System Workflow

```text
User Login
      │
      ▼
Upload Resume (PDF / DOCX)
      │
      ▼
Cloudinary Storage
      │
      ▼
Resume Parser
      │
      ▼
Resume JSON
      │
      ▼
Paste Job Description
      │
      ▼
Job Description Parser
      │
      ▼
Matching Engine
      │
      ▼
ATS Compatibility Engine
      │
      ▼
Gemini AI Optimization
      │
      ▼
Validation Layer
      │
      ▼
Resume Analysis Report
      │
      ▼
Choose Resume Template
      │
      ▼
Generate PDF / DOCX
      │
      ▼
Download Optimized Resume
```

---

# 🎨 UI Theme

**Theme:** Royal Black & Gold

### Color Palette

| Element    | Color     |
| ---------- | --------- |
| Background | `#F7F4ED` |
| Cards      | `#FFFFFF` |
| Primary    | `#B8860B` |
| Secondary  | `#7A4E1D` |
| Text       | `#1A1A1A` |

The interface is designed to provide a premium, elegant, and professional experience.

---

# 📁 Project Structure

```
Yukti-AI/

frontend/

backend/

docs/

assets/

README.md
```

---

# 🚀 Future Roadmap

### Version 2

* AI Cover Letter Generator
* LinkedIn Summary Generator
* AI Interview Questions
* Skill Gap Analysis
* Career Recommendations
* Portfolio Suggestions
* Resume Analytics Dashboard
* Multiple Resume Versions
* Resume Sharing
* Email Integration

---

# 🔒 Ethical AI Principles

Yukti AI is built around responsible AI.

It prioritizes:

* Truthfulness
* Transparency
* Explainability
* User Control
* Data Privacy

The platform improves how users present their experience—it does **not** fabricate qualifications.

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Developed By

**Syam**

Building intelligent software that combines **AI**, **Java**, and **modern web technologies** to help professionals advance their careers.

---

## ⭐ If you find this project useful, consider giving it a Star on GitHub!
