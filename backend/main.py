"""
main.py

FastAPI entrypoint for Role 3's chatbot.

Run locally:
    uvicorn main:app --reload --port 8000

Contract for frontend (put this in CONTRACTS.md):

POST /chat
  body: {"question": "What was our biggest expense this month?"}
  response: {
    "answer": "...",          # plain-language string to render in chat window
    "type": "general" | "whatif" | "refusal",
    "evidence": {...}          # only present for "whatif" — optional to show
  }
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chat import answer_question

app = FastAPI(title="Finance Chatbot API")

# Allow the React dev server to call this during local development.
# Tighten allow_origins before deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(req: ChatRequest):
    return answer_question(req.question)