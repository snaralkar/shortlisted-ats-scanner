from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
import io

from models import RewriteRequest, ExportRequest
from services import resume_parser, claude_client, docx_generator
from db import save_scan, save_rewrites, get_scans

router = APIRouter(prefix="/scans", tags=["scans"])


@router.get("")
async def list_scans(user_id: str):
    """Scan history for the dashboard. Returns [] if Supabase isn't
    configured yet or the user has no scans — never errors on empty state."""
    return get_scans(user_id)


@router.post("/score")
async def score(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    job_title: str = Form("Untitled role"),
    user_id: str = Form("anonymous"),
):
    file_bytes = await resume.read()
    try:
        resume_text = resume_parser.extract_text(resume.filename, file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not resume_text:
        raise HTTPException(status_code=400, detail="Couldn't extract any text from that file.")

    formatting_flags = resume_parser.detect_formatting_flags(resume.filename, file_bytes)
    result = claude_client.score_resume(resume_text, job_description, formatting_flags)

    saved = save_scan(user_id, job_title, result)
    result["scan_id"] = saved[0]["id"] if saved else None
    result["resume_text"] = resume_text
    return result


@router.post("/rewrite")
async def rewrite(payload: RewriteRequest):
    result = claude_client.rewrite_resume(payload.resume_text, payload.missing_keywords)
    return result


@router.post("/export")
async def export(payload: ExportRequest):
    if not payload.resume_text:
        raise HTTPException(status_code=400, detail="resume_text is required to export a DOCX.")

    accepted_rows = [row.model_dump() for row in payload.rows]
    docx_bytes = docx_generator.build_resume_docx(payload.resume_text, accepted_rows)

    if payload.scan_id:
        save_rewrites(payload.scan_id, [{**row, "accepted": True} for row in accepted_rows])

    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=resume_final.docx"},
    )
