# Tasky 

**Tasky** is a fullstack task management application designed to help users organize their day-to-day activities efficiently. Users can register, manage tasks (incomplete, completed, or deleted), and even generate AI-powered summaries of their tasks using **Gemini AI**.

##  Live Demo

Access the live application here: [https://tasky-fullstack.vercel.app/](https://tasky-app.vercel.app)

> ⚠️ You must be logged in to use most features.

---

## ✨ Features

### 🔐 Authentication
- User registration and login (JWT-based)
- Password strength validation
- Unique email/username enforcement
- Profile management (update profile, change password)
- Avatar upload via **Cloudinary**

### 📝 Task Management
- Create, update, and delete tasks
- Toggle completion status
- Recover deleted tasks
- View tasks by category:
  - Incomplete
  - Completed
  - Deleted

### 🤖 AI-Powered Task Summarization
- Integrated **Gemini AI** to generate smart summaries of all incomplete tasks


### 🌐 Frontend
- Built with **React**, **TypeScript**, **Material UI**, and **Zustand**
- Responsive layout with clean UI
- Protected routes for authenticated users
- Toast messages for feedback

### 🔙 Backend
- Built with **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**
- RESTful API design
- Cloudinary integration for avatar uploads
- Middleware for request validation and authentication
- AI route using Google Gemini API for task summaries

---

##  Technologies Used

### Frontend
- Vite + React + TypeScript
- Material UI
- Zustand (State Management)
- Axios + React Query
- Vercel (Deployment)

### Backend
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- Cloudinary (Image hosting)
- Gemini AI (Task summarization)
- Render (Deployment)

---



