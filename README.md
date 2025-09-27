# ThinkInk

Live demo: https://think-ink-jet.vercel.app/

ThinkInk is a full-stack blogging platform with AI-assisted content features, user authentication, likes, comments, saved/bookmarked posts, and a simple dashboard/profile UI.

Table of contents
- Project summary
- Features
- Tech stack
- Repository layout
- Quick start (development)
- Environment variables
- Seed data
- API reference
- Frontend notes (Vite)
- Docker & docker-compose
- Deployment (Vercel) notes & common build issues
- Troubleshooting
- Contributing
- License & contact

## Project summary
ThinkInk lets users create and manage blog posts, like and comment on posts, save/bookmark posts into their profile, and use AI-powered utilities (summaries / generation). The repo contains an Express + MongoDB backend (`thinkink/backend`) and a Vite + React frontend (`thinkink/frontend`).

## Features
- User authentication (JWT)
- CRUD posts with image upload (Cloudinary)
- Like/unlike posts
- Save/unsave (bookmarks) to user profile
- Comments
- AI summarization (Google Gemini integration) and utilities
- Profile + dashboard with saved posts tab
- Minimal, mobile-friendly UI with Framer Motion animations

## Tech stack
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Images: Cloudinary
- Optional: Redis (jobs/caching)
- Dev/Deployment: Docker, docker-compose; frontend often deployed on Vercel

