---
trigger: always_on
---

<!-- File: .agents/rules/schema-design.md -->
# Schema design rules

- Normalize relationships that are genuinely relational (e.g. question options)
  into their own table with a foreign key. Do not default to JSON columns for
  convenience — only use JSON for genuinely heterogeneous, low-query-need data
  (e.g. per-question-type validation rules, theme settings).
- Every foreign key needs an explicit ON DELETE behavior (cascade where a child
  row is meaningless without its parent — e.g. questions when a form is deleted).
- Before implementing a new table, output the proposed columns + relationships
  and one sentence of "why this shape and not the alternative" before writing
  the SQLAlchemy model.