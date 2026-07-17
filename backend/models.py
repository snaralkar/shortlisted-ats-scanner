from pydantic import BaseModel
from typing import List, Optional


class ScoreResult(BaseModel):
    score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    formatting_flags: List[str]
    summary: str


class RewriteRow(BaseModel):
    original: str
    rewritten: str
    reason: str


class RewriteResult(BaseModel):
    rewrites: List[RewriteRow]


class RewriteRequest(BaseModel):
    resume_text: str
    missing_keywords: List[str]


class ExportRequest(BaseModel):
    scan_id: Optional[str] = None
    resume_text: Optional[str] = None
    rows: List[RewriteRow]
