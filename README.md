📝 ThinkInk – AI-Powered Blogging Platform
📌 Overview

ThinkInk is a backend-heavy content aggregation platform that scrapes blogs, generates AI summaries, caches trending posts, and serves paginated feeds efficiently.

✨ Features

🔐 Authentication & Authorization – JWT-based secure login and signup.

🤖 AI-Powered Content Generation – Integrated Google Gemini API for auto-summarization & content generation.

🖼️ Image Uploads – Cloudinary storage for user-uploaded media.

📊 Trending Blogs Dashboard – Web scraping for the latest tech blogs.

📝 CRUD Operations – Users can create, update, delete, and manage blogs.

⚡ Responsive Design – Built with React.js + Tailwind for mobile-first UI.

🌍 Deployment – Hosted on Vercel (frontend) and Render (backend).

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

AI: Google Gemini API

Storage: Cloudinary

Hosting: Vercel, Render

🚀 Live Demo

🔗 Live Application

⚙️ Installation

Clone the repo

git clone https://github.com/prashantsingh1122/ThinkInk.git
cd ThinkInk


Install dependencies

npm install


Add environment variables in .env file

MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_URL=your_cloudinary_url


Start the development server

npm run dev
