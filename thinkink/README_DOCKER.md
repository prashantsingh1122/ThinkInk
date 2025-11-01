## Learn Docker with THINKINK (Minimal Setup)

This is a minimal, step-by-step Docker setup to help you learn. It wires up only the backend and MongoDB first. You can add the frontend afterwards.

### Files you now have
- `thinkink/backend/Dockerfile`: how to build/run the backend image
- `thinkink/docker-compose.yml`: runs backend + Mongo together
- `thinkink/frontend/Dockerfile` and `thinkink/frontend/nginx.conf`: optional, to containerize the frontend later

### 1) Build and run backend + Mongo
From the `thinkink` folder:

```bash
docker compose up --build -d
```

What happens:
- Builds the backend image using `backend/Dockerfile`
- Starts `mongo` (official `mongo:6` image)
- Sets `MONGO_URI=mongodb://mongo:27017/thinkink` in the backend
- Publishes backend on `http://localhost:5000`

Check logs:

```bash
docker compose logs -f backend
```

Stop everything:

```bash
docker compose down
```

Reset volumes (removes Mongo data):

```bash
docker compose down -v
```

### 2) How the backend Dockerfile works
1. Base image: `node:20-alpine`
2. `WORKDIR /app`: sets working directory inside the container
3. Copies `package*.json` and runs `npm ci --omit=dev` (faster caching)
4. Copies the rest of the code
5. Exposes port 5000 and starts `node server.js`

### 3) Compose networking explained
- Each service gets a hostname equal to its service name (e.g., `mongo`)
- Backend connects to Mongo at `mongodb://mongo:27017/thinkink`
- Ports map container -> host (5000:5000)

### 4) Add the frontend later (optional)
To also run the frontend, you can add this to `docker-compose.yml`:

```yaml
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    depends_on:
      - backend
```

Then:

```bash
docker compose up --build -d frontend
```

Open `http://localhost:5173`.

Tip: In production builds your app should call the backend using an absolute URL (e.g., `http://localhost:5000/api`) or you can later add an Nginx proxy.


