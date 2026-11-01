# Full-Stack MERN Student Management System
**Student:** Rohan Reshi | **PRN:** 202401040034 | **Assignment:** Web Technology Practical 7

A student-record manager using React, Express, Node.js, MongoDB Atlas and Mongoose.

## Features
- Create, read, update and delete student records.
- Validation and unique PRN/email.
- Search by name/email/PRN; filter by course.
- Sort by newest/oldest/name; server-side pagination.
- Credentials stored in environment variables.

## Run locally
Requirements: Node.js 18+, npm and MongoDB Atlas/local MongoDB.

1. Create a MongoDB Atlas cluster and database user. Allow your IP in Network Access.
2. In `backend`, copy `.env.example` to `.env` and enter your MongoDB URI.
3. Run `cd backend && npm install && npm run dev`.
4. In another terminal run `cd frontend && npm install && npm run dev`.
5. Open `http://localhost:5173`. Backend health check: `http://localhost:5000/health`.

Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/student_management?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```
Never commit `.env` or expose database credentials.

## API
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/students` | Create |
| GET | `/api/students` | List/search/filter/sort/page |
| GET | `/api/students/:id` | Read one |
| PUT | `/api/students/:id` | Update |
| DELETE | `/api/students/:id` | Delete |
| GET | `/health` | Health check |

Query example: `/api/students?search=rohan&course=B.Tech&sort=name_asc&page=1&limit=10`

Example body:
```json
{"name":"Rohan Reshi","email":"rohan.reshi@example.com","prn":"202401040034","mobile":"9876543210","course":"B.Tech","department":"AIML","year":3}
```

## Deployment
Backend: create a Render Web Service, root directory `backend`, build `npm install`, start `npm start`; configure `MONGODB_URI`, `CLIENT_ORIGIN`, `NODE_ENV=production`.
Frontend: deploy `frontend` to Vercel/Netlify; set `VITE_API_URL` to `https://your-backend-host/api`. Set backend `CLIENT_ORIGIN` to the frontend URL and redeploy.

**Important:** This package has not been deployed from this workspace. Add your actual GitHub/live URLs and capture genuine screenshots after setup. Keep `node_modules` and `.env` out of the submission ZIP.
