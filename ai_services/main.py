# ai_service/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from google import genai
from dotenv import load_dotenv
import os

# i load env before anything else
load_dotenv()

# initialize fastapi app
app = FastAPI()

# initialize gemini client using api key from env
# i never hardcode the key, always from env
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# REQUEST SCHEMA 
# this define what express must send to this service
class SingleReview(BaseModel):
    username: str
    review: str
    rating: int

class AnalyzeRequest(BaseModel):
    question: str
    reviews: List[SingleReview]

#PROMPT BUILDER
# i build structured prompt so gemini gives consistent formatted output
def build_prompt(question: str, reviews: List[SingleReview]) -> str:
    # format each review nicely for gemini to read
    reviews_text = ""
    for i, r in enumerate(reviews, 1):
        reviews_text += f"\nReview {i} by {r.username} (Rating: {r.rating}/5):\n{r.review}\n"

    prompt = f"""You are a helpful product review analyst.

You have been given a set of real user reviews for a product.
A user has asked a specific question about this product.

Your job is to answer the question using ONLY the information found in the provided reviews.
Do NOT use any outside knowledge.
If the reviews do not contain enough information to answer, clearly say so.
If reviewers have contradicting opinions, mention both sides.

User Question:
{question}

Product Reviews:
{reviews_text}

Respond in this exact format:

Answer:
[your concise answer here based only on reviews]

Pros:
- [pro point from reviews]
- [pro point from reviews]

Cons:
- [con point from reviews]
- [con point from reviews]

Confidence:
[High / Medium / Low] - [one line reason based on how many reviews mention this topic]
"""
    return prompt

# HEALTH CHECK
@app.get("/")
def root():
    # i use this to verify fastapi is running before testing analyze endpoint
    return {"message": "AI review service is running"}

#ANALYZE ENDPOINT
@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        # basic validation
        if not request.question.strip():
            raise HTTPException(status_code=400, detail="question cant be empty")

        if len(request.reviews) == 0:
            raise HTTPException(status_code=400, detail="no reviews provided")

        # build the prompt
        prompt = build_prompt(request.question, request.reviews)

        # call gemini flash model
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # extract text from response
        result = response.text

        if not result:
            raise HTTPException(status_code=500, detail="gemini returned empty response")

        return {"result": result}

    except HTTPException:
        # re raise http exceptions as is
        raise

    except Exception as e:
        # catch all other errors - gemini api failures, network issues etc
        raise HTTPException(status_code=500, detail=f"ai analysis failed: {str(e)}")
    