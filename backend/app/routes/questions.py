import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from ..database.mongodb import get_database
from ..models.question import AskQuestionRequest, QuestionResponse, SimilarQuestionSchema
from ..auth.jwt_handler import get_current_user
from ..services.ai import get_ai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/questions", tags=["Questions"])

@router.post("/ask", response_model=QuestionResponse)
def ask_question(request: AskQuestionRequest, current_user: dict = Depends(get_current_user)):

    """
    Submits a study question, finds top 3 similar questions in the database,
    automatically tags it with a topic, and saves it.
    """
    db = get_database()
    ai_service = get_ai_service()
    
    question_text = request.question.strip()
    
    # 1. Fetch all previously stored questions (across the entire platform for collaborative similarity matching)
    try:
        stored_questions_cursor = db.questions.find({}, {"question": 1, "tag": 1})
        stored_questions = list(stored_questions_cursor)
    except Exception as e:
        logger.error(f"Failed to fetch stored questions: {e}")
        stored_questions = []

    # 2. Find top 3 similar questions using cosine similarity (also infers the tag)
    similar_questions = ai_service.find_similar_questions(question_text, stored_questions, top_k=3)

    # 3. Automatically assign a topic tag to the question (reuses cached embedding from above)
    tag = ai_service.auto_tag_question(question_text)
    
    # 4. Construct and save the question document
    new_question = {
        "userId": current_user["_id"],
        "question": question_text,
        "tag": tag,
        "similarQuestions": similar_questions,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        result = db.questions.insert_one(new_question)
        question_id = str(result.inserted_id)
        
        logger.info(f"Question saved with ID {question_id} for user {current_user['email']}")
        
        return QuestionResponse(
            id=question_id,
            userId=new_question["userId"],
            question=new_question["question"],
            tag=new_question["tag"],
            similarQuestions=[SimilarQuestionSchema(**q) for q in new_question["similarQuestions"]],
            createdAt=new_question["createdAt"]
        )
    except Exception as e:
        logger.error(f"Failed to save question to DB: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save study question to the database."
        )

@router.get("/history", response_model=List[QuestionResponse])
def get_history(tag: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    """
    Get the question history of the current user, optionally filtered by tag.
    """
    db = get_database()
    
    query = {"userId": current_user["_id"]}
    if tag and tag.lower() != "all":
        query["tag"] = tag
        
    try:
        # Only fetch fields the UI needs — skip heavy embedded similarQuestions array
        projection = {
            "_id": 1,
            "userId": 1,
            "question": 1,
            "tag": 1,
            "similarQuestions": 1,
            "createdAt": 1,
        }
        # Sort newest first, limit to 100 to keep response fast
        cursor = db.questions.find(query, projection).sort("createdAt", -1).limit(100)
        questions = []
        for doc in cursor:
            questions.append(QuestionResponse(
                id=str(doc["_id"]),
                userId=doc["userId"],
                question=doc["question"],
                tag=doc.get("tag", ""),
                similarQuestions=[SimilarQuestionSchema(**q) for q in doc.get("similarQuestions", [])],
                createdAt=doc["createdAt"]
            ))
        return questions
    except Exception as e:
        logger.error(f"Error fetching history for user {current_user['_id']}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve question history."
        )
