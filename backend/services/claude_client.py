"""Wraps calls to the Anthropic API for scoring and rewriting."""
import json
import os
from anthropic import Anthropic

_client: Anthropic | None = None


def get_client() -> Anthropic:
    global _client
    if _client is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY is not set. Add it to backend/.env (see .env.example)."
            )
        _client = Anthropic(api_key=api_key)
    return _client


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


def _parse_json_response(message) -> dict:
    text = "".join(block.text for block in message.content if block.type == "text")
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text)


def score_resume(resume_text: str, job_description: str, formatting_flags: list[str]) -> dict:
    client = get_client()
    user_prompt = f"""RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{job_description}

PRE-DETECTED FORMATTING FLAGS (include these verbatim in your formatting_flags list, plus any you notice):
{json.dumps(formatting_flags)}"""

    message = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1500,
        system=SCORING_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )
    return _parse_json_response(message)


def rewrite_resume(resume_text: str, missing_keywords: list[str]) -> dict:
    client = get_client()
    user_prompt = f"""RESUME TEXT:
{resume_text}

MISSING KEYWORDS TO WORK IN WHERE TRUTHFUL:
{json.dumps(missing_keywords)}"""

    message = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=2000,
        system=REWRITE_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )
    return _parse_json_response(message)
