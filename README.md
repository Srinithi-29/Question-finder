# Study Question Finder with Auto-Tagging

> **Live Demo:**
> - 🌐 **Frontend:** [https://question-finder-six.vercel.app](https://question-finder-six.vercel.app)
> - ⚙️ **Backend API:** [https://question-finder-xf7v.onrender.com](https://question-finder-xf7v.onrender.com)
> - 📂 **GitHub Repository:** [https://github.com/Srinithi-29/Question-finder](https://github.com/Srinithi-29/Question-finder)

---

## Option Chosen

**Option 2 – Semantic Duplicate/Similar Question Finder with Auto-Tagging**

A production-ready full-stack web application where students submit academic questions. The system automatically classifies the question into a subject (Biology, Physics, Chemistry, Mathematics, or Computer Science) using local AI embeddings and then retrieves the top 3 most semantically similar previously submitted questions using cosine similarity — all without any third-party AI APIs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite) + Tailwind CSS + Axios + React Router DOM |
| **Backend** | FastAPI (Python) + Uvicorn |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) + Bcrypt password hashing |
| **AI / Embedding Engine** | FastEmbed (`sentence-transformers/all-MiniLM-L6-v2` via ONNX Runtime) + Scikit-Learn Cosine Similarity |
| **Frontend Deployment** | Vercel |
| **Backend Deployment** | Render |

---

## Folder Structure

```text
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI elements (Navbar, ProtectedRoute)
│   │   ├── context/          # Global AuthContext (JWT state management)
│   │   ├── pages/            # Landing, Login, Signup, Dashboard, History
│   │   ├── services/         # Axios API client (reads VITE_API_URL)
│   │   ├── App.jsx           # Routing & App Root
│   │   └── index.css         # Tailwind directives & custom animations
│   ├── vercel.json           # SPA routing rewrites for Vercel
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── auth/             # JWT generation & Bcrypt password verification
│   │   ├── database/         # MongoDB client, connection & index setup
│   │   ├── models/           # Pydantic request/response schemas
│   │   ├── routes/           # API route handlers (auth & questions)
│   │   ├── services/         # AI embedding & similarity service (FastEmbed)
│   │   └── main.py           # App entry point, lifespan events, CORS config
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variable blueprint
│   └── .env                  # Local environment file (git-ignored)
│
└── README.md
```

---

## How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Python 3.11+](https://www.python.org/downloads/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (free tier is sufficient)

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
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your values in `.env`:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/
     DB_NAME=study_AI
     JWT_SECRET=your_secure_secret_key_here
     JWT_ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=120
     ```

5. **Start the backend server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   The API will be available at `http://localhost:8000`.

   > **Note:** On the first startup, FastEmbed will automatically download the `all-MiniLM-L6-v2` ONNX model (~45MB) from Hugging Face. Subsequent starts are instant.

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
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

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user, returns JWT token |
| `POST` | `/api/auth/login` | Authenticate user, returns JWT token |

### Questions & Search
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/questions/ask` | Submit a question — auto-tags and finds top 3 similar questions | ✅ Bearer Token |
| `GET` | `/api/questions/history` | Get the authenticated user's question history. Supports `?tag=Biology` filtering | ✅ Bearer Token |

---

## How the AI / ML Part Works

The core intelligence is a **5-step local AI pipeline** — no third-party AI APIs are used:

### 1. Text Embedding Generation
When a user submits a question, the backend passes it to **FastEmbed** (`sentence-transformers/all-MiniLM-L6-v2`), which runs the model via **ONNX Runtime** (not PyTorch). This converts the question text into a **384-dimensional dense vector** (embedding) that numerically encodes its semantic meaning.

### 2. Auto Subject Tagging
The system maintains **pre-computed embeddings** for 5 subject description strings (Biology, Physics, Chemistry, Mathematics, Computer Science). The incoming question's embedding is compared against all 5 subject embeddings using **cosine similarity**. The subject with the highest similarity score is assigned as the question's tag.

### 3. Semantic Similar Question Search
All previously stored questions are fetched from MongoDB. The stored questions are filtered to only those matching the **same subject tag** as the new question (to improve accuracy). Then **cosine similarity** (via Scikit-Learn) is computed between the new question's embedding and all filtered stored embeddings. The **top 3** questions with the highest similarity scores are returned.

### 4. Embedding Cache
For performance, question embeddings are stored alongside each question document in MongoDB. On subsequent requests, cached embeddings are loaded directly from the database — avoiding redundant model inference calls.

### Why FastEmbed instead of sentence-transformers?
The standard `sentence-transformers` library depends on **PyTorch**, which consumes ~400MB of RAM on startup alone — exceeding Render's free tier 512MB limit. FastEmbed runs the same model via **ONNX Runtime**, which is significantly more memory-efficient (~150MB total), making it suitable for free-tier cloud deployment.

---

## Deployment

### Backend → [Render](https://render.com)
- **Runtime:** Python
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:** `MONGO_URI`, `DB_NAME`, `JWT_SECRET`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`

### Frontend → [Vercel](https://vercel.com)
- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_URL=https://question-finder-xf7v.onrender.com`
