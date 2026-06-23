from pydantic import BaseModel, Field
from typing import List

class SimilarQuestionSchema(BaseModel):
    question: str
    similarity: int

class AskQuestionRequest(BaseModel):
    question: str = Field(..., min_length=5, max_length=1000, description="The study question text")

class QuestionResponse(BaseModel):
    id: str
    userId: str
    question: str
    tag: str
    similarQuestions: List[SimilarQuestionSchema]
    createdAt: str
