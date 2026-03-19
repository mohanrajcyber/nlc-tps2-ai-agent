# NLC TPS-II AI Agent

**AI-powered Operations Dashboard for NLC Thermal Power Station II**
Built for the CSE Division — Real-time unit monitoring, fault diagnosis, shift logs and intelligent AI chat.

---

## Features

- Live Operations Dashboard — All 7 units with generation MW, efficiency, steam temp, fault status
- AI Chat Agent — Fault diagnosis, procedures, shift reports (offline + Llama 3 via Ollama)
- Tamil Language Support — Ask in Tamil, get answers in Tamil
- Active Faults Panel — Filter by CRITICAL / WARNING / OPEN / MONITOR / CLOSED
- Shift Log Tab — Add and view shift entries with unit tagging
- Reports Tab — Shift Handover, Efficiency, and Fault Analysis reports
- Secure Login — JWT auth, role-based access (Engineer / Technician / DGM / Admin)
- 100% Offline AI — No data leaves NLC network

---

## Quick Start

### Backend
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```bash

API: http://localhost:8000 | Docs: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```bash

Frontend: http://localhost:5173

### AI Engine (Optional)
```bash
ollama pull llama3
ollama serve
```bash

Without Ollama, AI works in smart offline mode with built-in NLC TPS-II knowledge base.

---

## Demo Login

| Employee ID | Password | Role |
|-------------|----------|------|
| admin | admin | Engineer |
| NLC-CSE-001 | nlc123 | Engineer |
| NLC-DGM-001 | nlc123 | Management |

---

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI + Python
- AI: Ollama + Llama 3 (local, offline)
- Auth: JWT (PyJWT)

---

## Built By

**Mohanraj** — NLC India Limited, CSE Division, TPS-II

*NLC TPS-II AI Agent — Internal Use — CSE Division — Neyveli Lignite Corporation*
