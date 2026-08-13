# Typeform Clone

A highly polished, full-stack clone of Typeform featuring a drag-and-drop form builder, dynamic custom themes, and the signature full-screen conversational respondent flow.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, React, CSS Modules, Framer Motion (for animations), dnd-kit (for drag and drop).
- **Backend:** Python, FastAPI, Pydantic.
- **Database:** SQLite with SQLAlchemy ORM.

## 🏗️ Architecture Overview

The application is split into a decoupled frontend and backend:

1. **Frontend (Next.js):** 
   - Uses Server-Side Rendering capabilities where applicable but heavily relies on Client Components for the interactive builder and respondent flows.
   - All styling is done with Vanilla CSS Modules to ensure a custom, high-fidelity design matching Typeform without relying on generic utility frameworks.
   - **`/dashboard`**: Handles form management and creation (CRUD).
   - **`/f/[shareSlug]`**: The public respondent flow. State is managed centrally in this component to prevent page reloads, allowing Framer Motion to handle the directional slide animations between questions.

2. **Backend (FastAPI):**
   - Provides a RESTful API with strict Pydantic schema validation.
   - Separate routers for authenticated actions (`/forms`) and public respondent actions (`/public`).
   - SQLite is used as the relational database, ensuring simple setup while maintaining strict referential integrity for forms, questions, options, and answers.

## 🗄️ Database Schema

The database relies on strict normalization for core entities, with JSON columns used selectively for heterogeneous data (like validation rules and themes).

- **`workspaces`**: Organizes forms (id, name).
- **`forms`**: The root entity for a survey (id, title, status, share_slug, theme_settings).
- **`questions`**: Linked to a form (id, type, title, required, order_index, validation_rules).
- **`question_options`**: Linked to a question for choice-based types (id, label, order_index).
- **`responses`**: A single submission instance for a form (id, started_at, submitted_at, completed).
- **`answers`**: The individual data points linked to a response and question (id, response_id, question_id, value).

*Note: All foreign keys implement cascading deletes to ensure data integrity.*

## 🔌 API Overview

### Creator API (`/api/forms`)
- `GET /` - List all forms
- `POST /` - Create a new form
- `GET /{id}` - Get full form details (with questions and options)
- `PUT /{id}` - Update form (including publish status and themes)
- `POST /{id}/duplicate` - Deep copy a form and its questions
- `PUT /{id}/questions/reorder` - Bulk update question ordering
- `GET /{id}/responses` - Fetch all submissions for the results view

### Public API (`/api/public`)
- `GET /f/{slug}` - Fetch a published form strictly by its secure share slug.
- `POST /f/{slug}/responses` - Submit a payload of answers. (Includes server-side validation against the form's constraints).

## 🛠️ Local Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python seed.py # Optional: Seeds the database with mock forms and responses
uvicorn app.main:app --reload
```
*The backend will run on `http://localhost:8000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:3000`*

## 🤔 Assumptions Made
- We assume a default "logged-in" creator since true authentication was deemed out of scope.
- We assume that the respondent flow does not require tracking partial abandonment beyond what the client actively submits, though the database schema supports `completed=False` flags for future use.
- The UI mimics desktop web workflows. Mobile responsiveness is functional but optimized for the desktop builder experience.
