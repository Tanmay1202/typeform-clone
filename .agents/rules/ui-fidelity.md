---
trigger: always_on
---

<!-- File: .agents/rules/ui-fidelity.md -->
# UI fidelity rules

- Reference images will be attached directly in chat when working on the
  builder or respondent flow — match spacing, type scale, and motion from
  those, not a generic guess at "clean SaaS UI."
- The respondent flow is full-screen, one question at a time, centered content,
  generous whitespace, one accent color. No visible chrome besides a thin
  progress indicator.
- Transitions between questions must be animated (Framer Motion), not an
  instant swap. Slide/fade on advance, reversed on going back.
- Keyboard nav: Enter or Down arrow advances (only if the current question is
  valid or not required), Up arrow goes back.
- Prefer real polish (motion, spacing, empty states, toasts) over adding more
  half-finished features.