# NLC TPS-II AI Agent — FastAPI Backend
# Run: uvicorn main:app --host 0.0.0.0 --port 8000

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import jwt
import httpx
import json

# ─── App Setup ───────────────────────────────────────────────
app = FastAPI(title="NLC TPS-II AI Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vercel + local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Config ──────────────────────────────────────────────────
SECRET_KEY = "nlc-tps2-secret-change-in-production"
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 8
OLLAMA_URL = "http://localhost:11434/api/generate"  # Local LLM
OLLAMA_MODEL = "llama3"                              # Run: ollama pull llama3

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ─── Mock User DB (replace with PostgreSQL) ──────────────────
USERS_DB = {
    "admin": {"name": "Admin", "password": "admin", "role": "Engineer", "division": "CSE"},
    "NLC-CSE-001": {"name": "Mohanraj", "password": "nlc123", "role": "Engineer", "division": "CSE"},
    "NLC-CSE-002": {"name": "Rajan",    "password": "nlc123", "role": "Technician", "division": "CSE"},
    "NLC-DGM-001": {"name": "DGM Kumar","password": "nlc123", "role": "Management", "division": "CSE"},
}

# ─── Models ──────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = "NLC TPS-II CSE Division operations"

class FaultReport(BaseModel):
    equipment: str
    symptoms: List[str]
    severity: str
    diagnosed_by: Optional[str] = "AI Agent"
    actions_taken: Optional[str] = ""

class ShiftLog(BaseModel):
    event: str
    tag: str   # OK | Warn | Alert
    unit: Optional[str] = "Unit 2"

# ─── Auth Helpers ────────────────────────────────────────────
def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        emp_id = payload.get("sub")
        if emp_id not in USERS_DB:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {**USERS_DB[emp_id], "emp_id": emp_id}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired — please login again")
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")

# ─── Routes: Auth ────────────────────────────────────────────
@app.post("/auth/login", response_model=Token)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = USERS_DB.get(form.username)
    if not user or user["password"] != form.password:
        raise HTTPException(status_code=401, detail="Invalid Employee ID or password")
    token = create_token({"sub": form.username, "role": user["role"]})
    return {"access_token": token, "token_type": "bearer",
            "user": {"name": user["name"], "role": user["role"], "emp_id": form.username}}

# ─── Routes: AI Chat ─────────────────────────────────────────
@app.post("/ai/chat")
async def chat(req: ChatRequest, user=Depends(get_current_user)):
    """Send a question to the local LLM (Ollama). No data leaves NLC network."""
    system_prompt = f"""You are the NLC TPS-II AI Agent for the CSE Division at 
Neyveli Lignite Corporation Thermal Power Station II. You help engineers, 
technicians, and management with:
- Equipment fault diagnosis (PA Fan, CEP, ID Fan, Boiler, Turbine, Transformer)
- Shift log analysis and summaries
- Technical operational questions about thermal power plant operations
- Report generation assistance

Always give concise, actionable answers. If a fault is critical, say so clearly.
Current user: {user['name']} ({user['role']})
Context: {req.context}"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"System: {system_prompt}\n\nUser: {req.message}\n\nAssistant:",
        "stream": False,
        "options": {"temperature": 0.3, "num_predict": 512}
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OLLAMA_URL, json=payload)
            result = response.json()
            return {"reply": result.get("response", "").strip(), "model": OLLAMA_MODEL}
    except httpx.ConnectError:
        # Fallback if Ollama not yet running
        return {"reply": f"[Demo mode] AI Agent received: '{req.message}'. "
                         "Connect Ollama (ollama serve) for live AI responses.", "model": "demo"}

# ─── Routes: Fault Logs ──────────────────────────────────────
fault_log_db = []  # Replace with PostgreSQL table

@app.post("/faults/log")
async def log_fault(fault: FaultReport, user=Depends(get_current_user)):
    entry = {
        "id": len(fault_log_db) + 1,
        "timestamp": datetime.now().isoformat(),
        "logged_by": user["name"],
        "role": user["role"],
        **fault.dict(),
        "status": "Open"
    }
    fault_log_db.append(entry)
    return {"message": "Fault logged successfully", "fault_id": entry["id"]}

@app.get("/faults/list")
async def list_faults(user=Depends(get_current_user)):
    return {"faults": fault_log_db, "total": len(fault_log_db)}

@app.patch("/faults/{fault_id}/close")
async def close_fault(fault_id: int, user=Depends(get_current_user)):
    for f in fault_log_db:
        if f["id"] == fault_id:
            f["status"] = "Closed"
            f["closed_by"] = user["name"]
            f["closed_at"] = datetime.now().isoformat()
            return {"message": "Fault closed", "fault": f}
    raise HTTPException(status_code=404, detail="Fault not found")

# ─── Routes: Shift Log ───────────────────────────────────────
shift_log_db = []  # Replace with PostgreSQL table

@app.post("/shiftlog/add")
async def add_shift_log(log: ShiftLog, user=Depends(get_current_user)):
    entry = {
        "id": len(shift_log_db) + 1,
        "time": datetime.now().strftime("%H:%M"),
        "timestamp": datetime.now().isoformat(),
        "logged_by": user["name"],
        **log.dict()
    }
    shift_log_db.append(entry)
    return {"message": "Shift log entry added", "entry": entry}

@app.get("/shiftlog/today")
async def get_shift_log(user=Depends(get_current_user)):
    today = datetime.now().date().isoformat()
    today_logs = [l for l in shift_log_db if l["timestamp"].startswith(today)]
    return {"logs": today_logs, "shift_date": today}

# ─── Routes: Report Generation ───────────────────────────────
@app.get("/reports/shift-summary")
async def shift_summary(user=Depends(get_current_user)):
    """Generate AI-powered shift summary from today's logs and faults."""
    today = datetime.now().date().isoformat()
    open_faults = [f for f in fault_log_db if f["status"] == "Open"]
    today_logs = [l for l in shift_log_db if l["timestamp"].startswith(today)]

    prompt = f"""Generate a concise shift summary report for NLC TPS-II CSE Division.

Shift date: {today}
Open faults ({len(open_faults)}): {json.dumps([f['equipment'] + ' - ' + f['severity'] for f in open_faults])}
Shift log entries ({len(today_logs)}): {json.dumps([l['event'] for l in today_logs])}

Write a professional 5-6 line shift handover summary."""

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(OLLAMA_URL, json={
                "model": OLLAMA_MODEL, "prompt": prompt, "stream": False,
                "options": {"temperature": 0.2, "num_predict": 300}
            })
            summary = res.json().get("response", "").strip()
    except:
        summary = f"Shift Summary — {today}: {len(today_logs)} log entries recorded. {len(open_faults)} faults open. Connect Ollama for AI-generated summaries."

    return {"summary": summary, "generated_at": datetime.now().isoformat(),
            "generated_by": "NLC TPS-II AI Agent", "requested_by": user["name"]}

# ─── Health Check ─────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "online", "system": "NLC TPS-II AI Agent", "version": "1.0.0"}
