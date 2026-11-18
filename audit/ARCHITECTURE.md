# Existing architecture (before audit fixes)

Baseline: `7918ce7e27457c55b44304d69eaa47d7649bebd2`. The manifest loads 29 classic deferred scripts and 22 CSS files in order. There is no framework, backend, package installer, or build step.

- `app.js`: initial units, global view/unit/session/answer/history, storage, base renderers and speech.
- `enhancements.js`: original translation support and feedback.
- `v3.js`: bilingual dictionaries, expanded original content, matching and translation engines.
- `v4.js`: Future Simple data, guides, formula drills, top navigation, question metadata.
- `v5.js`: missing-form grammar database, feedback, topic directory, matching.
- `v6.js`: session-to-grammar mappings, session hub, usage explanations.
- `v7.js`: compact subject/form rules.
- `v8.js`: vocabulary coverage, batching, vocabulary quiz and local progress.
- `v9.js`: remaining Continuous sessions, vocabulary expansions, progress dashboard.
- `v10.js`: paired navigation and input/feedback positioning.
- `v11.js`, `v12.js`, `v13.js`: targeted grammar explanations and compact answered sentences.
- `v14.js`, `v15.js`: standalone/session grammar links and mastery dashboard.
- `v16.js`: spaced vocabulary review, course completion/mastery and final home layout.
- `v17.js`: vocabulary topic stickers.
- `v21-checker.js`: shared approved-equivalence translation grading.
- `v21-content.js`: added bilingual content, vocabulary classes and guide labels.
- `content-quality.js`: lesson-local supplemental vocabulary and lexical hint generation.
- `present-simple-v20.js`: replaces Present Simple with six banks; owns closure-local vocabulary, grammar and translation states, 90 grammar items and 90 translations.
- `v21-audit.js`: content checks and legacy feedback wrapper.
- `v22-everyday.js`: closure-local number/date/time/money generator, validator, practice/listen/assessment and progress.
- `v22-extras.js`: numerical matching and reference lists.
- `v23-learning-units.js`: four-unit directory, details and numerical instructions.
- `v24-navigation-fixes.js`: grammar-only library, sticker selection and nav state.
- `v22-integration.js`: active legacy submit functions, stable translation deck, attempt adapters, Future sentence building.
- `vietnamese-ui.js`: locale-specific names/rules and final renderer.
- `v22-attempts.js`: immutable first-answer ledger, shared results, separate review and confirmation dialogs. Loaded early but invoked after other globals initialize.

## Data flow

`units[id].sessions[index].words` is the shared vocabulary source. Legacy translations come from `v3vn/v3en`; Present Simple installs equivalent projections of its private JSON pack. Hints inspect each model and that question's lesson bank. Numerical questions are generated independently.

Initialization -> stable attempt deck -> selected/typed response -> type-specific validator -> first-answer ledger -> feedback -> next -> results. Review uses copied question/previous-answer records and independent correction counts. Render functions replace `#app` with HTML, then older wrappers decorate its DOM. Most buttons use inline handlers with globals.

Persistent progress is fragmented across `wynnling-progress`, `wynnling-vocab-progress-v1`, `wynnling-grammar-progress-v1`, `wynnling-word-review-v1`, `wynnling-translation-review-v1`, `wynnling-present-simple-v20`, and `wynnling-v22-everyday-progress`. Interface locale and voice have separate keys.

## CSS

All stylesheets are referenced. `styles/theme/cobalt` establish base design; `v4`–`v17` layer existing components; `present-simple-v20`, `v22-everyday`, `v23-learning-units`, `v24-navigation-fixes`, `v25-unit4-lessons`, `v26-compact-layout` specialize them. Repeated selectors often intentionally override earlier rules. Removing a versioned file wholesale would remove live behavior or styling.

## Confirmed audit targets

- Unsafe/untyped storage reads can prevent startup.
- Present Simple closure state and global session disagree; its completed translations/grammar do not update dashboard history.
- Numerical completion is stored separately from dashboard mastery; time-to-digits prompts omit AM/PM.
- Exact duplicate Future translation exists twice in one bank; retain source records but avoid repeating it within an attempt.
- Date answers omit/reject the year while cues show it; ordinal suffix validation accepts incorrect suffixes.
- Inline speech handler breaks on an apostrophe in `brush one's teeth`.
- Older scripts repeatedly render incomplete startup state.
- Private dead semantic-checking helpers and numerical result markup are unreachable.
- Missing-data guards and real DOM/viewport tests are absent from existing tests.
