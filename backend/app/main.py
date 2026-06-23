import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.mongodb import init_db, close_database_connection
from .services.ai import get_ai_service
from .routes import auth, questions

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events.
    """
    logger.info("Initializing application services...")
    
    # 1. Connect to MongoDB and build indexes
    try:
        init_db()
    except Exception as e:
        logger.error(f"Failed to initialize database during startup: {e}")
        
    # 2. Pre-load AI model to memory so first request is fast
    try:
        get_ai_service()
    except Exception as e:
        logger.error(f"Failed to load AI model during startup: {e}")
        
    logger.info("Application services ready.")
    yield
    
    # 3. Shutdown cleanup
    logger.info("Shutting down application services...")
    close_database_connection()
    logger.info("Application stopped.")

app = FastAPI(
    title="Study Question Finder with Auto-Tagging API",
    description="Backend API powered by local SentenceTransformer embeddings for matching and auto-tagging.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
# Since authentication uses JWT tokens stored in localStorage and sent via headers
# rather than Cookie-based auth, we can safely allow all origins using "*"
# which prevents CORS issues on Render/Vercel dynamic staging deploys.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Set to False when allow_origins is "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(questions.router)

@app.get("/")
def health_check():
    """
    Service health check endpoint.
    """
    return {
        "status": "healthy",
        "service": "Study Question Finder API",
        "model": "all-MiniLM-L6-v2"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=True)
