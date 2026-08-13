# Typeform Clone

A functional clone of Typeform, recreating its signature conversational, one-question-at-a-time form filling experience, robust form builder, and results dashboard.

## Features Built
- **Form Builder**: Add, edit, delete, and drag-and-drop reorder questions (using `dnd-kit`). Real-time editing.
- **Respondent Flow**: Signature one-question-at-a-time UI with Framer Motion slide transitions. Supports keyboard navigation (Enter to advance, Up Arrow to go back).
- **Results Dashboard**: Summary tab with calculated charts for multiple-choice questions, and a detailed submissions list with modal overlay.
- **Public Share Links**: Secure `share_slug` endpoints for respondent flows.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + CSS Modules (Vanilla CSS)
- **Backend**: Python + FastAPI
- **Database**: SQLite (via SQLAlchemy ORM)
- **Animation/Drag-and-Drop**: Framer Motion, @dnd-kit/core

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Backend Setup
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Seed the database** (creates tables and populates realistic dummy data):
   ```bash
   python seed.py
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will be available at `http://localhost:8000`.*

### Frontend Setup
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:3000`.*

---

## Architecture Overview

The application uses a decoupled client-server architecture:

1. **Frontend (Next.js)**: Handles routing, state management, and all user interactions. 
   - Uses CSS Modules to strictly scope styles and avoid global conflicts without relying on utility frameworks like Tailwind.
   - Heavy use of `Framer Motion`'s `AnimatePresence` to intercept component unmounting and execute seamless vertical slide animations during the respondent flow.
   - API calls are centralized in `lib/api.ts`.
   
2. **Backend (FastAPI)**: Serves as a RESTful JSON API.
   - Organized into modular routers (`forms`, `questions`, `responses`, `public`).
   - The public router (`/api/public/f/{share_slug}`) operates independently of the internal `form_id` endpoints to ensure unauthenticated users cannot guess form IDs or access draft forms.

---

## Database Schema (SQLite)

The database normalizes forms, questions, options, and responses for high data integrity.

- `forms`: Core metadata (title, description, status, share_slug, theme_settings).
- `questions`: Belongs to a form. Has a specific `type` (SHORT_TEXT, MULTIPLE_CHOICE, etc.), `order_index` for sorting, and JSON `validation_rules`.
- `question_options`: For `MULTIPLE_CHOICE` or `DROPDOWN` questions. Normalizing options into a separate table ensures referential integrity when users change option text later.
- `responses`: Tracks a single respondent's session (`started_at`, `submitted_at`, `completed`).
- `answers`: The individual answers provided by a respondent, linking a `question_id` to a `response_id` with a string `value`.

---

## API Overview

### Internal (Creator) API
- `GET /api/forms/` - List all forms.
- `POST /api/forms/` - Create a new form.
- `GET /api/forms/{form_id}` - Get full form details (with questions and options).
- `PUT /api/forms/{form_id}/questions/reorder` - Bulk update the `order_index` of multiple questions atomically.
- `GET /api/forms/{form_id}/responses/` - Get all collected responses for a form.

### Public (Respondent) API
- `GET /api/public/f/{share_slug}` - Fetch a published form (and its questions) for filling. Returns 403 if the form is still a draft.
- `POST /api/public/f/{share_slug}/responses` - Submit a completed response dictionary. Handles the complex relational insertion of the `Response` and all its `Answers` in one atomic transaction.

---

## Assumptions Made

1. **No Creator Authentication**: As permitted by the brief, creator authentication has been omitted. The dashboard assumes a single, default logged-in creator who owns all forms.
2. **Optimistic Drag-and-Drop**: When reordering questions in the builder, the frontend updates locally instantly for UX, and sends a bulk `question_ids` array to the backend to sync the `order_index`. If the API fails, a robust implementation would revert the local state, but this edge case is currently ignored for simplicity.
3. **No File Uploads or Payments**: These complex question types have been stubbed out as placeholders per the brief's allowance.
4. **CSS over Tailwind**: The user explicitly requested "Vanilla CSS", so CSS Modules were used globally to enforce strict, clean styling.
