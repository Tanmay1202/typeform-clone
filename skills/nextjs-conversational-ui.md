<!-- File: skills/nextjs-conversational-ui.md -->
# One-question-at-a-time flow — implementation pattern

- Single client component holds currentIndex state and a direction flag
  (forward/back), not per-question route navigation — this is what makes the
  animated transition possible.
- Wrap the current question in Framer Motion's AnimatePresence, keyed by
  question id, so React treats each question as entering/exiting rather than
  updating in place.
- Direction-aware animation: slide up + fade in when advancing, slide down +
  fade in when going back — direction flag controls the initial/exit offsets.
- Progress bar = (currentIndex / totalQuestions) * 100, animated width
  transition, not a hard jump.
- Local answer state is held per-question in the parent and only POSTed to the
  backend on final submit — except for partial-response tracking, where the
  first answer written should also create the Response row server-side.