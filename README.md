# Study Question Finder with Auto-Tagging

A production-ready full-stack web application designed to help students submit questions, automatically tag them with academic subjects, and locate semantically similar historical questions using local AI embeddings.

---

## Technical Architecture

- **Frontend:** React.js (Vite) + Tailwind CSS + Axios + React Router DOM
- **Backend:** FastAPI (Python) + Uvicorn
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt password hashing
- **Local AI Engine:** SentenceTransformer (`all-MiniLM-L6-v2` model) + Scikit-Learn Cosine Similarity

---

## Folder Structure

```text
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI elements (Navbar, ProtectedRoute)
│   │   ├── context/          # Global AuthContext
│   │   ├── pages/            # View Pages (Landing, Login, Signup, Dashboard, History)
│   │   ├── services/         # Axios API Client
│   │   ├── App.jsx           # Routing & App Root
│   │   └── index.css         # Tailwind directives & Custom animations
│   ├── tailwind.config.js    # Tailwind layout configuration
│   ├── postcss.config.js     # PostCSS loader configuration
│   └── vite.config.js        # Vite compiler config
│
├── backend/
│   ├── app/
│   │   ├── auth/             # JWT encryption & Password verification
│   │   ├── database/         # MongoDB Client & Index definitions
│   │   ├── models/           # Pydantic schemas (Request / Response validation)
│   │   ├── routes/           # Routing layers (Auth & Questions endpoints)
│   │   ├── services/         # AI SentenceTransformer matching service
│   │   └── main.py           # App initialization, lifespan events, and CORS configuration
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables blueprint
│   └── .env                  # Local environment file (ignored in git)
│
└── README.md                 # Detailed documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python 3.9+](https://www.python.org/downloads/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB server

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   - Copy `.env.example` to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your **MongoDB Atlas connection string** and customize the **JWT Secret Key**.

5. **Start the backend server:**
   ```bash
   python app/main.py
   ```
   *Note: On the first startup, it will automatically download the `all-MiniLM-L6-v2` SentenceTransformer model (approx. 90MB). Consecutive loads will be instant.*
   The server will start at `http://localhost:8000`.

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Create a `.env` file in the `frontend` folder:
     ```env
     VITE_API_URL=http://localhost:8000
     ```

4. **Start the frontend application:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## API Endpoints Map

### Authentication APIs
- `POST /api/auth/signup` - Registers a new user, hashes password, returns user details + JWT token.
- `POST /api/auth/login` - Authenticates user credentials, returns user details + JWT token.

### Question & Search APIs
- `POST /api/questions/ask` - Submit a study question. Automatically assigns a topic tag and retrieves the Top 3 contextually similar questions. (Requires JWT Header: `Authorization: Bearer <token>`).
- `GET /api/questions/history` - Retrieve question submission history for the logged-in user. Supports subject filtering with query parameter `tag` (e.g. `/api/questions/history?tag=Biology`). (Requires JWT Header: `Authorization: Bearer <token>`).

---

## Deployment Guide

### Backend (Render)

1. Create a Web Service on [Render](https://render.com/).
2. Select your repository.
3. Configure the environment:
   - **Runtime:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**, add the variables defined in `backend/.env.example` (such as `MONGO_URI`, `JWT_SECRET`, etc.).

### Frontend (Vercel)

1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. Configure settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add the **Environment Variable** `VITE_API_URL` pointing to your deployed Render URL (without the trailing slash, e.g. `https://study-question-finder-backend.onrender.com`).
