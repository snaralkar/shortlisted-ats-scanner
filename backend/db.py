"""Supabase (Postgres) connection for the `scans` and `rewrites` tables.
Auth itself is handled entirely by Supabase Auth on the frontend — this
client uses the service role key for trusted server-side writes only.
"""
import os
from supabase import create_client, Client

_client: Client | None = None


def get_db() -> Client | None:
    global _client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return None  # backend runs fine without persistence for local dev/demo
    if _client is None:
        _client = create_client(url, key)
    return _client


def save_scan(user_id: str, job_title: str, result: dict) -> dict | None:
    db = get_db()
    if db is None:
        return None
    row = {
        "user_id": user_id,
        "job_title": job_title,
        "score": result["score"],
        "matched_keywords": result["matched_keywords"],
        "missing_keywords": result["missing_keywords"],
        "formatting_flags": result["formatting_flags"],
    }
    return db.table("scans").insert(row).execute().data


def get_scans(user_id: str) -> list[dict]:
    """Returns the user's past scans, most recent first. Empty list (not an
    error) if Supabase isn't configured or the user has no scans yet."""
    db = get_db()
    if db is None:
        return []
    result = (
        db.table("scans")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data or []


def save_rewrites(scan_id: str, rows: list[dict]) -> dict | None:
    db = get_db()
    if db is None:
        return None
    payload = [
        {
            "scan_id": scan_id,
            "original_text": r["original"],
            "rewritten_text": r["rewritten"],
            "accepted": r.get("accepted", False),
        }
        for r in rows
    ]
    return db.table("rewrites").insert(payload).execute().data
