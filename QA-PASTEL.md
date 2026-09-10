# Pastel sunrise update — QA checkpoint (2026-09-10)

Status: candidate; not approved for production. Real Gemini API key has not been entered or tested.

Changes: warm cream/peach/mint interface, larger controls and reading sizes, mobile help access, explicit selected values in subject/grade/model controls, accent-insensitive Vietnamese search, stable exploration duration, in-flight generation guard, stale model-connection cancellation, connection timeout, and AI configuration without closing the current lesson. Existing storage key and saved lesson format retained.

Verified:
- Next.js production build completed successfully.
- TypeScript check passed after production types regenerated.
- Five built-in simulations: default calculation, parameter endpoints, reset, all quiz answers, sandbox policy; refraction total internal reflection and quadratic a=0 handled (scripts/test-simulations.mjs).
- Browser: desktop pastel layout, selected subject/grade rendering, Ohm U=24/R=20 returns 1.200 A and 28.80 W, correct quiz feedback, reset, presentation class, save and saved lesson persistence after reload, accentless search khuc xa, chemistry filter, empty result/reset filters, opening AI configuration from an active simulation.

Still required before release:
- Real Gemini: list models, text generation, file generation, regenerate, edit, cancellation and failure recovery.
- Full browser pass for other built-ins, upload acceptance/rejection, offline download, mobile layout and keyboard/accessibility checks.
- Final production build and production smoke test after release.

Blocker: the secure browser credential request was rejected by automatic security review because its generated sign-in label misrepresented an API-key configuration flow. No key was collected, exposed, persisted, or committed. Do not substitute mocked generation results for real API verification.
