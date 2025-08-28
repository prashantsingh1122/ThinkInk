# ThinkInk Development Setup

This guide will help you set up the ThinkInk project for local development without affecting the deployed version.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Redis (optional, for caching)

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development environment:**
   ```bash
   npm run dev
   ```

This will start both frontend and backend servers:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Manual Start

If you prefer to start services individually:

### Backend Only
```bash
cd backend
npm run dev:local
```

### Frontend Only
```bash
cd frontend
npm run dev
```

## Environment Configuration

### Frontend (.env.local)
Create a `.env.local` file in the `frontend` directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEV_MODE=true
```

### Backend Environment
Make sure your backend has the necessary environment variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Development vs Production

- **Development**: Uses local backend (localhost:5000)
- **Production**: Uses deployed backend (thinkink-backend.onrender.com)

The configuration automatically switches based on the environment.

## Network Access

The development server is configured to be accessible on your local network:
- Frontend: Available on your local IP address
- Backend: Available on your local IP address

## Stopping Development

Press `Ctrl+C` in the terminal to stop all development servers.

## Troubleshooting

1. **Port conflicts**: If port 5000 or 5173 are in use, modify the ports in the respective config files
2. **CORS issues**: The backend is configured to allow requests from localhost
3. **Database connection**: Ensure your MongoDB instance is running and accessible

## Making Changes

All changes made locally will not affect the deployed version. To deploy changes:

1. Test thoroughly in development
2. Commit your changes
3. Push to your deployment branch
4. The deployment platform will automatically build and deploy

## File Structure

```
thinkink/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── dev-start.js       # Development startup script
├── package.json       # Root package.json with dev scripts
└── DEVELOPMENT.md     # This file
```
