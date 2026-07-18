"""AI layer for scoring + rewriting.

Uses Google Gemini's free tier by default (GEMINI_API_KEY). If you'd rather
use Anthropic's Claude API instead (e.g. once you've added credits), set
ANTHROPIC_API_KEY and AI_PROVIDER=anthropic — no other code changes needed.
"""
import json
import os

SCORING_SYSTEM_PROMPT = """You are an ATS (Applicant Tracking System) matching engine.

Given a resume's text and a job description, you will:
1. Extract the top 15-20 relevant keywords/skills from the job description.
2. Check which of those appear in the resume, allowing reasonable synonyms and
   variants (e.g. "SQL" matches "Structured Query Language").
3. Note any formatting issues that were flagged separately (passed to you as
   a list) and fold them into your response unchanged.

Return STRICT JSON only, no preamble, no markdown fences, in exactly this shape:
{
  "score": <integer 0-100>,
  "matched_keywords": ["..."],
  "missing_keywords": ["..."],
  "formatting_flags": ["..."],
  "summary": "one sentence explanation of the score"
}"""

REWRITE_SYSTEM_PROMPT = """You are a resume editor helping a candidate pass ATS
keyword matching honestly.

Given the resume's text and a list of missing keywords, rewrite the weakest
bullet points so they:
- Naturally incorporate relevant missing keywords where truthful
- Use stronger action verbs
- Suggest a placeholder metric format (e.g. "reduced X by [add %]") when the
  original bullet has no number — NEVER invent a specific fake number
- NEVER add responsibilities, tools, or experience the candidate did not
  already mention somewhere in the original resume

Return STRICT JSON only, no preamble, no markdown fences, in exactly this shape:
{"rewrites": [{"original": "...", "rewritten": "...", "reason": "..."}]}"""


def _clean_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text)


def _provider() -> str:
    return os.environ.get("AI_PROVIDER", "gemini").lower()


# ---------------------------------------------------------------- Gemini ---

def _gemini_generate(system_prompt: str, user_prompt: str) -> dict:
    from google import genai

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Add it to backend/.env (see .env.example). "
            "Get a free key at https://ai.google.dev"
        )
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"{system_prompt}\n\n{user_prompt}",
    )
    return _clean_json(response.text)


# -------------------------------------------------------------- Anthropic --

def _anthropic_generate(system_prompt: str, user_prompt: str, max_tokens: int) -> dict:
    from anthropic import Anthropic

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set. Add it to backend/.env.")
    client = Anthropic(api_key=api_key)
    message = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )
    text = "".join(block.text for block in message.content if block.type == "text")
    return _clean_json(text)


# ------------------------------------------------------------- public API --

def score_resume(resume_text: str, job_description: str, formatting_flags: list[str]) -> dict:
    user_prompt = f"""RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{job_description}

PRE-DETECTED FORMATTING FLAGS (include these verbatim in your formatting_flags list, plus any you notice):
{json.dumps(formatting_flags)}"""

    if _provider() == "anthropic":
        return _anthropic_generate(SCORING_SYSTEM_PROMPT, user_prompt, max_tokens=1500)
    return _gemini_generate(SCORING_SYSTEM_PROMPT, user_prompt)


def rewrite_resume(resume_text: str, missing_keywords: list[str]) -> dict:
    user_prompt = f"""RESUME TEXT:
{resume_text}

MISSING KEYWORDS TO WORK IN WHERE TRUTHFUL:
{json.dumps(missing_keywords)}"""

    if _provider() == "anthropic":
        return _anthropic_generate(REWRITE_SYSTEM_PROMPT, user_prompt, max_tokens=2000)
    return _gemini_generate(REWRITE_SYSTEM_PROMPT, user_prompt)
