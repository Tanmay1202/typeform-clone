---
trigger: always_on
---

<!-- File: .agents/rules/explain-as-you-go.md -->
# Explain-as-you-go rule

After generating any non-trivial backend logic (a new router, a schema change,
anything involving async/session handling, dependency injection, or a
non-obvious query), append an entry to docs/LEARNING.md in this format:

## <file/feature name>
- What problem this solves
- Why this approach over the obvious alternative
- Any FastAPI/SQLAlchemy/Pydantic concept a backend beginner needs to
  understand this (explain the concept itself, briefly, not just name it)

Do the same for non-obvious frontend state or animation logic (e.g. how
question-transition direction is tracked, how drag-reorder persists to the
backend).