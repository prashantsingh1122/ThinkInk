# ThinkInk — Backend-Driven Content Aggregation Platform

ThinkInk is a backend-focused content aggregation system that automatically scrapes blogs, generates AI-powered summaries, caches trending content using Redis, and serves paginated feeds efficiently through a scalable API architecture.

The project is designed to demonstrate real-world backend engineering practices such as caching strategies, pagination, containerization, and system trade-offs — not just feature implementation.

---

## 🚀 Core Features

- Automated blog scraping to populate content feeds  
- AI-generated summaries using Gemini API  
- Redis caching for trending and latest posts  
- Paginated API responses for scalable feed delivery  
- Dockerized backend services  
- Public demo feed for unauthenticated users  
- Secure environment-based configuration  
- Modular backend architecture  

---

## 🧱 System Architecture

┌────────────┐
│ Blog Sites │
└─────┬──────┘
↓
┌───────────────┐
│ Scraper Layer │
└─────┬─────────┘
↓
┌───────────────┐
│ Database │ ← Source of Truth
└─────┬─────────┘
↓
┌───────────────┐
│ Redis Cache │ ← Hot / Trending Data
└─────┬─────────┘
↓
┌───────────────┐
│ API Layer │
└─────┬─────────┘
↓
┌───────────────┐
│ Frontend UI │
└───────────────┘

---

## 🧠 Key Engineering Decisions

### 1️⃣ Redis for Hot Data Caching
Redis is used to cache:
- Trending posts  
- Latest posts  
- Frequently accessed feed data  

This reduces repeated database reads and improves response times for high-traffic endpoints.

**Cache Strategy**
- Read-through caching  
- TTL-based expiration  
- Database fallback on cache miss  

---

### 2️⃣ Pagination for Scalable Feed Delivery
All feed endpoints are paginated with a default limit of 20 items per request.

This prevents:
- Overfetching  
- Large response payloads  
- Memory pressure on the server  

---

### 3️⃣ Decoupled Scraping and Feed Serving
Scraping is handled independently from feed delivery.

This ensures:
- Feed availability even if scraping fails  
- Better fault isolation  
- Predictable API performance  

---

### 4️⃣ AI Summary Generation
Blog content is summarized using the Gemini API.

Summaries are generated once and stored, avoiding repeated AI calls for the same content.

---

## 🐳 Dockerized Setup

The backend services are containerized using Docker to ensure:
- Consistent development and deployment environments  
- Easy local setup  
- Clear service isolation  

docker compose up --build


🔐 Environment Configuration

#All sensitive configuration is managed using environment variables:

DB_URL
REDIS_URL
GEMINI_API_KEY
PORT


Environment validation is enforced at application startup to prevent misconfiguration.

📦 Tech Stack

Backend

Node.js

Express.js

Redis

MongoDB

Gemini API

Infrastructure

Docker

Docker Compose

Frontend

React (Demo / Public Views)

📊 Performance & Optimization

Redis cache reduces repeated database queries

Pagination limits response payload size

Cached trending content improves feed load times

AI calls minimized through stored summaries

🔍 Project Focus

This project intentionally emphasizes:

Backend scalability concepts

Caching and performance optimization

System design thinking

Production-style architecture

UI is kept minimal to prioritize backend correctness and efficiency.

📄 Documentation

SECURITY.md — Security policies

Redis caching strategy documentation (in progress)

Inline comments for critical backend logic

📌 Future Improvements

Background job queue for scraping and AI processing

API rate limiting

Structured logging and metrics

Expanded unit test coverage

🧑‍💻 Author

Prashant Singh
Backend-Focused Full Stack Developer
GitHub: https://github.com/prashantsingh1122
