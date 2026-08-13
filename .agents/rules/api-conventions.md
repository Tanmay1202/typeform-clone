---
trigger: always_on
---

<!-- File: .agents/rules/api-conventions.md -->
# API conventions

- All creator-facing (authenticated-assumed) endpoints live under /api/forms/...
- All respondent-facing (public, no-auth) endpoints live under /api/public/...
  Never add an auth check inline in a creator route as a substitute for this
  split — the split IS the auth boundary.
- Use Pydantic response_model on every route; never return raw SQLAlchemy
  objects.
- Bulk operations (like reordering questions) get one endpoint that accepts the
  full new order, not N sequential per-item calls.
- Every error path returns a proper HTTPException with a real status code, not
  a 200 with an "error" field in the body.