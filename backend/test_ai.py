import sys
import os

# Add the current directory to python path to resolve app imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.ai import get_ai_service

def test_ai():
    print("Initializing AI Service (loading sentence-transformers)...")
    ai = get_ai_service()
    
    # Test Auto-Tagging
    biology_q = "Why does photosynthesis require sunlight?"
    physics_q = "What is Newton's second law of motion?"
    chemistry_q = "Explain the periodic table structure and chemical bonding."
    math_q = "How do you solve a quadratic equation using the formula?"
    cs_q = "What is the difference between an array list and a linked list in terms of complexity?"
    
    print("\n--- Testing Auto-Tagging ---")
    for q in [biology_q, physics_q, chemistry_q, math_q, cs_q]:
        tag = ai.auto_tag_question(q)
        print(f"Q: '{q}'\n=> Tag: {tag}\n")
        
    # Test Similarity
    print("\n--- Testing Similarity Match ---")
    stored_questions = [
        {"question": "How do plants convert sunlight into food?"},
        {"question": "What is chlorophyll and how is it used in photosynthesis?"},
        {"question": "What are the equations of motion by Newton?"},
        {"question": "How does dynamic programming work in algorithm design?"},
        {"question": "What is the atomic mass of carbon?"}
    ]
    
    target_q = "Why do plants need solar light for photosynthesis?"
    print(f"Target Q: '{target_q}'")
    matches = ai.find_similar_questions(target_q, stored_questions, top_k=3)
    for m in matches:
        print(f"- Match: '{m['question']}' ({m['similarity']}% similarity)")

if __name__ == "__main__":
    test_ai()
