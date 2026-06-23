import logging
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# Available topics as requested
AVAILABLE_TAGS = [
    "Biology",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Computer Science"
]

# Topic descriptions optimized for semantic similarity
TOPIC_DESCRIPTIONS = {
    "Biology": "Biology: study of living organisms, cells, photosynthesis, genetics, plants, animals, ecology, human body, and evolution.",
    "Physics": "Physics: study of matter, motion, energy, force, gravity, Newton's laws, relativity, mechanics, thermodynamics, and electricity.",
    "Chemistry": "Chemistry: study of chemicals, atoms, molecules, chemical reactions, periodic table, bonding, compounds, and mixtures.",
    "Mathematics": "Mathematics: study of numbers, algebra, calculus, geometry, arithmetic, equations, proofs, and statistics.",
    "Computer Science": "Computer Science: study of programming, algorithms, data structures, software engineering, databases, coding, and computation."
}

class AIService:
    def __init__(self):
        logger.info("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("SentenceTransformer model loaded successfully.")
        
        # Precompute embeddings for topic descriptions to optimize auto-tagging
        self.topic_tags = AVAILABLE_TAGS
        topic_texts = [TOPIC_DESCRIPTIONS[tag] for tag in self.topic_tags]
        self.topic_embeddings = self.model.encode(topic_texts)
        logger.info("Precomputed embeddings for topic tags.")
        
        # Cache for question embeddings
        self._question_embedding_cache = {}
        self._cache_loaded = False

    def generate_embedding(self, text: str) -> np.ndarray:
        """
        Generate embedding vector for a given string text.
        """
        return self.model.encode(text)

    def auto_tag_question(self, question_text: str) -> str:
        """
        Auto-assign a topic tag to a question based on semantic similarity to topic descriptions.
        """
        question_emb = self.generate_embedding(question_text).reshape(1, -1)
        
        # Calculate cosine similarity against all topic embeddings
        similarities = cosine_similarity(question_emb, self.topic_embeddings)[0]
        
        # Find index of highest similarity
        max_idx = np.argmax(similarities)
        assigned_tag = self.topic_tags[max_idx]
        
        logger.info(f"Auto-tagging: '{question_text}' -> '{assigned_tag}' (similarity: {similarities[max_idx]:.4f})")
        return assigned_tag

    def find_similar_questions(self, target_question: str, stored_questions: list, top_k: int = 3) -> list:
        """
        Compare target question against previously stored questions using cosine similarity.
        The comparison is limited to questions that share the same inferred subject tag.
        - stored_questions: list of dicts, each having a 'question' and 'tag' key.
        - Returns top_k similar questions as list of dicts with question and similarity percentage.
        """
        if not stored_questions:
            return []

        # First, infer the subject tag for the incoming question
        inferred_tag = self.auto_tag_question(target_question)

        # For any stored question missing a tag, auto-tag it on-the-fly
        # (handles old DB documents that were saved before tagging was added)
        for q in stored_questions:
            if not q.get('tag'):
                q['tag'] = self.auto_tag_question(q['question'])
                # Persist the tag back to DB so we don't re-compute it next time
                try:
                    from ..database.mongodb import get_database
                    db = get_database()
                    db.questions.update_one({"_id": q.get("_id")}, {"$set": {"tag": q['tag']}})
                except Exception:
                    pass

        # Filter stored questions to only those with the same subject tag
        filtered_questions = [q for q in stored_questions if q.get('tag') == inferred_tag]
        logger.info(f"Tag filter: '{inferred_tag}' matched {len(filtered_questions)}/{len(stored_questions)} stored questions.")
        # Only fall back if there are genuinely zero questions in this subject
        if not filtered_questions:
            logger.warning(f"No stored questions found for tag '{inferred_tag}'. Returning empty list.")
            return []

        # Ensure question embeddings are cached
        if not self._cache_loaded:
            # Load embeddings from DB on first call
            from ..database.mongodb import get_database
            db = get_database()
            cursor = db.questions.find({"embedding": {"$exists": True}}, {"_id": 1, "embedding": 1})
            for doc in cursor:
                self._question_embedding_cache[str(doc["_id"])] = np.array(doc["embedding"])
            self._cache_loaded = True
        
        # Prepare embeddings for similarity comparison
        target_emb = self.generate_embedding(target_question).reshape(1, -1)
        # Gather embeddings for filtered questions (use cache when possible)
        stored_embs = []
        question_texts = []
        for q in filtered_questions:
            qid = q.get("_id") or q.get("id")
            if qid and str(qid) in self._question_embedding_cache:
                stored_embs.append(self._question_embedding_cache[str(qid)])
            else:
                # Compute on‑the‑fly and cache it
                emb = self.generate_embedding(q["question"])
                stored_embs.append(emb)
                # If we have DB access, store the embedding for future use
                try:
                    from ..database.mongodb import get_database
                    db = get_database()
                    db.questions.update_one({"_id": qid}, {"$set": {"embedding": emb.tolist()}})
                except Exception:
                    pass
            question_texts.append(q["question"])
        stored_embs = np.vstack(stored_embs)
        similarities = cosine_similarity(target_emb, stored_embs)[0]

        # Build similarity results
        results = []
        for i, score in enumerate(similarities):
            percentage = int(max(0.0, float(score)) * 100)
            results.append({
                "question": question_texts[i],
                "similarity": percentage,
                "tag": inferred_tag
            })

        # Sort and deduplicate
        results.sort(key=lambda x: x["similarity"], reverse=True)
        seen = set()
        deduped = []
        for item in results:
            if item["question"].lower() == target_question.lower():
                continue
            if item["question"] not in seen:
                seen.add(item["question"])
                deduped.append(item)
        return deduped[:top_k]

# Lazy-loaded singleton instance
_ai_service_instance = None

def get_ai_service() -> AIService:
    global _ai_service_instance
    if _ai_service_instance is None:
        _ai_service_instance = AIService()
    return _ai_service_instance
