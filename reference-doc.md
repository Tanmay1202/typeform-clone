# Typeform Builder

## SDE Fullstack Assignment

# Description

Build a functional clone of the Typeform application that replicates Typeform's design, user experience, and core form-building and form-filling workflows.

The platform should allow a creator to build forms with multiple question types via a drag-and-drop-style builder, publish them via a shareable link, collect responses through the signature one-question-at-a-time conversational experience, and view submitted results, all within the clean, focused interface of the original Typeform app.

Your implementation should visually and functionally feel like a modern Typeform. The two hardest and most important pieces are the builder and the polished, animated one-question-at-a-time respondent flow.

## AI Tools Usage

You are allowed and encouraged to use AI tools such as ChatGPT, Claude, GitHub Copilot, Cursor, or any other AI assistant for development. Use AI as heavily as you like to move fast. However, you must understand every line of code you submit and be prepared to explain your implementation decisions during the evaluation interview.

## Technical Stack

- **Frontend:** Next.js (TypeScript)
- **Backend:** Python with FastAPI / Django
- **Database:** SQLite (design your own schema)

> **Note:** The respondent flow (public form fill) should be a real, shareable experience — no auth required to fill a published form.

# Core Features (Must Have)

## 1. Form Builder

Recreate the Typeform builder.

- Create a form with a title and ordered list of questions
- Add, edit, reorder (drag-and-drop), and delete questions
- Question types:
  - Short text
  - Long text
  - Multiple choice
  - Dropdown
  - Email
  - Number
  - Yes/No
  - Rating
- Per-question settings:
  - Required toggle
  - Description/help text
- Live preview of the form

## 2. Form Management (CRUD)

- List the creator's forms with:
  - Status (draft/published)
  - Response count
- Create, rename, duplicate, and delete forms
- Publish / unpublish, generating a shareable public link
- All form definitions must persist

## 3. Respondent Flow (the Typeform Experience)

Implement the public form-filling experience.

- One question at a time, full-screen, with smooth transitions between questions
- Keyboard navigation (Enter/arrow to advance) and a progress indicator
- Client + server validation:
  - Required fields
  - Email format
  - Number validation
  - etc.
- Submit stores the response; show a thank-you screen
- No login required to fill a published form

## 4. Results / Responses

- Per-form responses view:
  - Table/list of submissions
- View an individual response in full
- Basic summary stats per question:
  - Counts for choice questions
  - etc.
- All responses must persist

## 5. Typeform Experience

The application should closely resemble the Typeform experience, including:

- The distinctive conversational, one-question-at-a-time fill UI with transitions
- Clean builder layout with live preview
- Forms, modals, and inline editing
- Notifications / toasts
- Settings placeholders:
  - Theme
  - Thank-you screen

The goal is to make the application feel like Typeform rather than a generic multi-field form.

# Mocked / Placeholder Sections

The following can be present as placeholders (a simple "Coming Soon" is sufficient):

- Advanced logic jumps / branching (basic branching is a bonus)
- Integrations / webhooks
- Team collaboration & sharing
- Payment/file-upload question types
- Real creator authentication may be simplified (assume a default logged-in creator)

# Bonus (Optional)

- Logic jumps / conditional branching
- Custom themes:
  - Colors
  - Fonts
  - Background
- Export responses as CSV
- Partial-response tracking / completion rate
- File-upload question type
- Dark mode

# Important Notes

## UI Design

Your application should totally resemble Typeform's design. Study Typeform's UI carefully before starting.

## Sample Data

Seed your database. Seed a couple of published forms with mixed question types and some existing responses so the app is immediately usable.

## Database Design

Design your own database schema. This will be evaluated.

## README File

Include:

- Setup instructions
- Tech stack used
- Architecture overview
- Database schema
- API overview
- Assumptions made

## Original Work

Plagiarism from existing repositories will result in immediate disqualification.

# Deliverables

## Source Code

A public GitHub repository containing:

```text
frontend/
backend/