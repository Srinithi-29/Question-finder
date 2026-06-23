import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "study_question_finder")

_client = None
_db = None

def get_database():
    """
    Get the MongoDB database instance. Initializes the client if it does not exist.
    """
    global _client, _db
    if _db is None:
        try:
            logger.info("Connecting to MongoDB...")
            # Set serverSelectionTimeoutMS to fail quickly if connection is down
            _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            # Trigger connection check
            _client.admin.command('ping')
            _db = _client[DB_NAME]
            logger.info("Successfully connected to MongoDB.")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise e
    return _db

def init_db():
    """
    Initialize database collections and unique indexes.
    """
    try:
        db = get_database()

        # Users: unique index on email for fast login + duplicate prevention
        db.users.create_index("email", unique=True)

        # Questions: compound index for fast history fetch (userId + sort by createdAt)
        db.questions.create_index([("userId", 1), ("createdAt", -1)])

        # Questions: compound index for tag-filtered history
        db.questions.create_index([("userId", 1), ("tag", 1), ("createdAt", -1)])

        logger.info("Database indexes initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        # Don't raise here; let main.py handle startup checks or fail gracefully

def close_database_connection():
    """
    Close the MongoDB connection.
    """
    global _client, _db
    if _client:
        logger.info("Closing MongoDB connection...")
        _client.close()
        _client = None
        _db = None
        logger.info("MongoDB connection closed.")
