# Docker Deployment Guide for THINKINK

This guide covers multiple deployment options for your Docker setup.

## Option 1: Railway (Recommended - Easiest) 🚀

Railway supports docker-compose natively - perfect for your setup!

### Steps:

1. **Sign up at Railway:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your THINKINK repository
   - Select the `thinkink` folder as root

3. **Configure Environment Variables:**
   - Railway will detect your docker-compose.yml
   - Go to "Variables" tab
   - Add all variables from `backend/.env`:
     - `MONGO_URI` (your MongoDB Atlas connection string)
     - `JWT_SECRET`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `GEMINI_API_KEY` (if used)
     - `OPENAI_API_KEY` (if used)

4. **Deploy:**
   - Railway automatically deploys when you push to GitHub
   - Or click "Deploy" manually

5. **Get Your URLs:**
   - Railway provides public URLs for both services
   - Frontend URL: something like `https://thinkink-frontend.railway.app`
   - Backend URL: something like `https://thinkink-backend.railway.app`

6. **Update Frontend Config:**
   - Set `VITE_API_BASE_URL` to your Railway backend URL
   - Or Railway can set this automatically via environment variables

**Cost:** Free tier available, then ~$5/month

---

## Option 2: DigitalOcean Droplet (Full Control) 🖥️

Deploy on your own VPS with full Docker control.

### Steps:

1. **Create Droplet:**
   - Go to https://digitalocean.com
   - Create a Droplet ($6/month basic)
   - Choose Ubuntu 22.04
   - Add SSH keys

2. **Connect via SSH:**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Docker & Docker Compose:**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   apt-get update
   apt-get install docker-compose-plugin -y
   
   # Verify
   docker --version
   docker compose version
   ```

4. **Clone Your Repo:**
   ```bash
   git clone https://github.com/yourusername/thinkink.git
   cd thinkink/thinkink
   ```

5. **Create `.env` file:**
   ```bash
   nano backend/.env
   ```
   Add all your environment variables (MONGO_URI, JWT_SECRET, etc.)

6. **Start Docker Compose:**
   ```bash
   docker compose up -d --build
   ```

7. **Set up Domain (Optional):**
   - Point your domain A record to Droplet IP
   - Use Nginx as reverse proxy (optional)

8. **Set up Firewall:**
   ```bash
   ufw allow 22    # SSH
   ufw allow 80    # HTTP
   ufw allow 443   # HTTPS
   ufw enable
   ```

**Cost:** $6-12/month

---

## Option 3: Fly.io (Good Balance) ✈️

Fly.io supports Docker and has a free tier.

### Steps:

1. **Install Fly CLI:**
   ```bash
   # Windows PowerShell
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Initialize App:**
   ```bash
   cd thinkink
   fly launch
   ```
   - Choose to deploy frontend and backend as separate apps

4. **Create `fly.toml` for Backend:**
   ```toml
   app = "thinkink-backend"
   primary_region = "iad"  # Choose closest region
   
   [build]
     dockerfile = "./backend/Dockerfile"
   
   [env]
     NODE_ENV = "production"
     PORT = "5000"
   
   [[services]]
     internal_port = 5000
     protocol = "tcp"
   ```

5. **Create `fly.toml` for Frontend:**
   ```toml
   app = "thinkink-frontend"
   primary_region = "iad"
   
   [build]
     dockerfile = "./frontend/Dockerfile"
   
   [[services]]
     internal_port = 80
     protocol = "tcp"
   ```

6. **Deploy:**
   ```bash
   fly deploy
   ```

**Cost:** Free tier available

---

## Option 4: Render (Keep Current Setup) 🎨

Render doesn't support docker-compose natively, but you can deploy services separately.

### Steps:

1. **Deploy Backend (Already done):**
   - You're already using Render for backend ✅

2. **Deploy Frontend:**
   - Create new "Web Service" on Render
   - Connect GitHub repo
   - Build Command: `cd frontend && npm run build`
   - Publish Directory: `frontend/dist`
   - OR use Render's Dockerfile support
   - Set `VITE_API_BASE_URL` to your Render backend URL

**Cost:** Free tier available

---

## Option 5: AWS/Azure/Google Cloud (Enterprise)

For production scale, consider:
- **AWS ECS/Fargate** - Container orchestration
- **Google Cloud Run** - Serverless containers
- **Azure Container Instances** - Managed containers

These require more setup but offer enterprise features.

---

## Pre-Deployment Checklist ✅

Before deploying anywhere, make sure:

- [ ] All environment variables are set (don't commit `.env` to Git!)
- [ ] `.gitignore` includes `.env`
- [ ] MongoDB Atlas connection string is correct
- [ ] Frontend config.js handles production properly
- [ ] CORS is configured for your production domain
- [ ] Cloudinary credentials are valid
- [ ] Test everything locally with `docker compose up`

---

## Recommended Setup for Your Case

Since you're already using:
- **Backend:** Render ✅
- **Frontend:** Vercel ✅
- **Database:** MongoDB Atlas ✅

**Best Option:** Keep current setup OR use **Railway** for full Docker deployment.

**If using Docker everywhere:** Railway is the easiest (supports docker-compose out of the box).

---

## Post-Deployment Steps

1. **Test your deployed app**
2. **Set up monitoring** (optional)
3. **Configure custom domain** (optional)
4. **Set up SSL/HTTPS** (usually automatic)
5. **Set up backups** for database

---

## Troubleshooting

### Backend won't connect to MongoDB
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Verify MONGO_URI is correct
- Check logs: `docker compose logs backend`

### Frontend can't reach backend
- Check CORS settings in backend
- Verify API URL in frontend config
- Check network connectivity

### Container keeps restarting
- Check logs for errors
- Verify all environment variables are set
- Ensure ports aren't conflicting

