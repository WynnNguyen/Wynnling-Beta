# Wynnling Beta — comprehensive codebase audit

Date: 18 November 2026. Baseline: `7918ce7e27457c55b44304d69eaa47d7649bebd2` in `WynnNguyen/Wynnling-Beta`, branch `main`.

## Scope and architecture

The existing application was audited and improved in place. All 62 baseline repository files were inspected, including the HTML manifest, 29 original JavaScript files, 22 stylesheets, tests, vocabulary baseline and existing documentation. The result loads 30 scripts, including one small dependency-free utility file. No framework, package dependency, backend, lesson or exercise type was added or replaced.

The application uses ordered classic scripts, shared lexical globals, closure-local exercise engines, inline event handlers and successive renderer wrappers. Older versioned files still provide live data, functions or CSS overrides. They were retained. See [the architecture map](audit/ARCHITECTURE.md), [source inventory](audit/inventory.json), and [baseline reproductions](audit/baseline-reproductions.json).

Preserved: four units; 21 sessions; vocabulary, grammar, translation and numerical exercise engines; matching, listening, sentence building, results, review and navigation; all 240 translation records; all 488 vocabulary entries, including intentional cross-session repetition. The six original Present Simple banks still contain 28 entries each, 90 grammar records and 90 translation records. The earlier 41 lesson-local vocabulary supplements were retained, not introduced by this audit.

## A. Problems discovered

| Finding | Cause and effect | Resolution / evidence |
| --- | --- | --- |
| High: Present Simple state disagreement | Its private session changed while the shared lexical `session` remained 0. This could send related navigation/progress to the wrong session. | Shared unit/session updated at entry points; regression opens session 4 and checks shared state. |
| High: missing Present Simple completion/progress | The private engine recorded its own history but did not update shared translation completion or session-specific grammar mastery. Completed lessons remained unfinished on the dashboard. | First-answer progress adapter and one-time completion hooks; real 15-question grammar/translation attempts and dashboard checked. |
| High: unsafe saved-data reads | Invalid JSON, null/array records, wrong field types or denied browser storage could break initialization or progress calculations. | Guarded, schema-aware storage access with bounded scores and memory fallback. Corrupt, blocked and quota-only storage cases executed. |
| Medium: stale matching timer | A wrong-pair timeout could clear selections after a new round/session opened. | Callback checks the captured round and current view; repeat-interaction regression passed. |
| Medium: duplicate visible quiz options | Distinct bank records could produce the same displayed option. Recall also required the whole slash-separated vocabulary label. | Unique option labels; only explicitly taught slash variants accepted for recall. MCQs still use exact selected-option matching. |
| Medium: duplicate translation in an attempt | Future information contains “How long will you stay?” twice in the same Vietnamese-to-English bank. | Both source records retained; active decks deduplicate identical direction/prompt/model combinations. That session has 14 distinct active questions instead of 15. |
| Medium: misleading Future formulas | Some question/negative prompts inherited the lesson's broad formula instead of their own sentence structure. | Question-specific metadata applied to stable decks; WH questions and negatives tested. |
| Medium: date/ordinal grading | Full written dates with the displayed year were rejected; `1th` was accepted as first. | Valid year forms and proper ordinal suffixes checked; malformed dates rejected. |
| Medium: ambiguous time cue | Word-to-digit time questions required 24-hour answers without identifying a.m./p.m. | Cue now includes the meridiem; browser accepted “quarter past eleven a.m.” → `11:15`. |
| Medium: numerical dashboard mismatch | Numerical scores were persisted separately while mastery expected vocabulary/grammar stages that those sessions do not have. | Numerical completion and ≥80% readiness now use the relevant assessment and its correct denominator. |
| Medium: malformed question handling | Some entry points assumed valid nonempty banks and could throw or render undefined content. | Guard translation pairs, grammar/vocabulary banks, numerical structures and route indices. Use verified records or a localized unavailable screen. Bounded generator fallback handles constant randomness. |
| Medium: broken pronunciation handler | An apostrophe in `brush one's teeth` terminated a single-quoted HTML event attribute. | Escape apostrophes inside speech attributes; 3,462 generated inline handlers now compile. Audio output itself remains device-dependent. |
| Medium: overly broad comma tolerance | Removing every comma could accept meaning-changing vocatives or relative clauses. | Optional commas limited to known introductory time phrases and conjunction positions. Harmless examples pass; cooking Mum/Grandma and restrictive-relative changes fail. |
| Low: misleading feedback | Generic grammar feedback mentioned future auxiliaries during other tenses; some reordered answers were labelled only as meaning errors. | Tense-neutral grammar explanation and explicit token-order mismatch feedback. |
| Low: unnecessary work and dead paths | Startup replaced the app 20 times; hint regex matching repeated; a feedback wrapper graded/decorated content overwritten by the final adapter. Private similarity helpers and old numerical result markup were unused/unreachable. | One final startup render; bounded hint cache with copies and invalidation; obsolete wrapper/helpers/markup removed. No broad file deletion. |
| Low: narrow-screen overflow | The header language controls exceeded a 320px viewport by 12px. | Header wraps below 480px. Retest: content width and scroll width both 305px within the 320px iframe. |

The reported disappearing MCQ selection was specifically investigated. It did **not** reproduce on the starting revision, which already had stable option/state handling. Live browser checks selected, changed, retained and submitted choices successfully. This audit strengthens option uniqueness and feedback; it does not claim to have newly reproduced and repaired the earlier reset bug.

## B. Changes implemented

| Files | What changed and why |
| --- | --- |
| `core-utils.js`, `index.html` | Shared storage/data guards and Fisher–Yates shuffle, loaded before consumers. Avoid repeated unsafe initialization and malformed-data crashes. |
| `app.js`, `v3.js`, `v8.js`, `v9.js`, `v16.js`, `present-simple-v20.js`, `v22-everyday.js` | Route saved reads/writes through guarded access; validate locale/score shapes; retain existing key names and vocabulary indices. |
| `present-simple-v20.js` | Synchronize sessions; bridge first submissions/completion into existing progress; persist per-session grammar scores; guard transitions; deduplicate visible choices; improve grammar hints; remove unused private validation helpers. |
| `v22-attempts.js` | Explicit first-record result, one-time completion hook, safe empty completion/cancel path, duplicate-dialog guard and expanded unfinished-navigation interception. Original scores remain immutable during retries/review. |
| `v22-integration.js` | Validate and build a stable deck before rendering; preserve cumulative scope; separate cumulative history keys by unit; guard drills/quizzes/builders; retain model-specific formulas and original banks. |
| `v8.js` | Prevent stale matching callbacks, consolidate shuffle, unique quiz choices and feedback based on the recorded validation result. |
| `content-quality.js` | Guard missing hint data; cache up to 256 results per bank with bank-edit invalidation and defensive copies; shared taught-variant recall checking. |
| `v21-checker.js` | Invalid-model guards, conservative comma tolerance, clearer grammar/punctuation feedback and word-order detection. Approved-equivalence grading remains separate from numerical/MCQ checking. |
| `v3.js`, `v4.js`, `v5.js`, `v8.js` | Correct HTML speech-handler escaping; `v4.js` also blocks advancing an unchecked grammar question. |
| `v16.js`, `v22-everyday.js` | Accurate numerical/session mastery; valid numerical schemas, full-date/ordinal fixes, AM/PM cue and bounded verified generation. Remove unreachable old results screen. |
| `v21-audit.js` | Retain the content audit; remove an uncomputed grammar counter and the obsolete duplicate feedback wrapper. |
| `v3.js`–`v17.js`, `present-simple-v20.js`, `v22-integration.js` | Remove intermediate startup render calls only. Keep live renderers, data, event handlers and CSS layers. |
| `v26-compact-layout.css` | Narrow-screen header wrapping; existing palette, typography and desktop layout retained. |
| `tests/runtime.cjs`, `tests/application.cjs` | Isolated storage/timer/listener instrumentation; membership assertion recognizes formula metadata clones that retain the lesson bank. |
| `tests/audit.cjs`, `tests/integrity.cjs`, `tests/check.cjs` | New behavioral/data checks and one dependency-free test command. |
| `.github/workflows/quality.yml` | Run the complete test command on main pushes and pull requests. |
| `.gitignore`, `README.md`, `audit/*`, this report | Exclude preview artifacts; document architecture, findings and reproducible verification. |

## C. Educational review and remaining manual review

All 240 active bilingual translation records were inspected alongside the session banks and checked automatically for model acceptance, hint relevance, homework misuse and unnatural “không đang” negatives. All have 1–4 optional lesson-scoped hints, totaling 493. The six sentences with at least 12 English words each have at least three hints. The existing natural ongoing-negative translations and do/does/doing/will-do-homework forms were retained. Legitimate essay/paragraph/answer uses of write are preserved. Unit 04's generated values, definitions, examples and Vietnamese instructions were included in the review.

Remaining items are explicit limitations, not automatically rewritten content:

- English *brother/sister* does not specify age, while some Vietnamese models choose *anh/chị/em*. For example, “My brother usually wakes up early...” uses “Anh trai tôi...”. A teacher should approve alternate kinship forms or make the English prompt age-specific. Current exact approved-equivalent grading can reject an otherwise valid Vietnamese choice.
- “How will we meet?” / “Chúng ta sẽ gặp nhau như thế nào?” is grammatically possible but needs a clearer situation for a beginner. “Will you join the party?” also merits teacher review against the lesson's taught use of join. Records were preserved rather than rewritten for style.
- Near-repeated affirmative/negative/question templates often serve different objectives. They were retained. The exact duplicate identified above is suppressed only within the active attempt.
- Natural-language validation recognizes approved equivalents, not arbitrary correct paraphrases. Vietnamese regional wording, pronoun choices, adverb placement and untaught synonyms may need teacher-approved additions. Tests do not prove universal semantic equivalence or complete linguistic naturalness.
- The layered global-wrapper architecture and CSS cascade remain maintenance risks. All older assets are referenced; removing them wholesale would break behavior. Future structural work should move one tested responsibility at a time.
- Progress remains browser-local. When storage is denied/full, the app stays usable in memory, but fallback progress does not survive closing/reloading the page. Unfinished attempt resumption after refresh is not implemented.
- Physical iOS/Android, Safari/Firefox, screen readers, actual audio playback/voice availability and prolonged memory/network profiling were not verified. Narrow viewports in Chromium are not physical touch-device certification.

## D. Executed testing results

Command: `node tests/check.cjs`. All six suites passed on the final source revision. Full output: [audit/TEST-RESULTS.txt](audit/TEST-RESULTS.txt).

| Executed check | Result |
| --- | --- |
| JavaScript syntax and manifest assets | 30 shipped scripts parse; 52 unique local JS/CSS references exist. |
| Existing regressions | Session banks, numerical decks, vocabulary progress, stickers and styling order pass. |
| Semantic/numerical validation | 25 core acceptance/rejection cases; 9,000 generated numerical items across nine digit lengths; boundaries 0 and 999,999,999; no billion; comma/hyphen/and variants pass. Additional meaning-changing punctuation and word-order cases pass. |
| Full script-order integration | Four engines, 21 sessions, all 240 model answers, cumulative unit scope, numerical matching and duplicate-submit protection pass. |
| Content/hints | 488 entries retain original vocabulary indices; all 240 bilingual records and 493 lesson-scoped hints pass; 180 Present Simple grammar/translation IDs are unique. |
| New audit regressions | 16 groups pass: startup/listeners, malformed/blocked/quota storage, session/progress/mastery, malformed banks, exact-duplicate decks, Future formulas, matching timeout, slash recall, hint cache, dates/ordinals and bounded generation. |
| Generated HTML handler syntax | 3,462 inline handlers compile across lesson/vocabulary/translation/quiz/grammar routes in both languages. Route scan reports no exceptions. This is syntax/route coverage, not proof that every possible click sequence was executed. |
| Browser: 390px MCQ/results/review | Selection changes and aria-pressed states persist; submission works; 10-question attempt scored 2/10; only eight mistakes offered; correction leaves original 2/10; restart cancel preserves results, restart clears score. |
| Browser: 1280px grammar | 15 questions, correct and incorrect submissions, retry/contractions; original first-answer score remains 14/15. |
| Browser: 1280px translation | 15 questions; bad word order rejected; “normally” alternative without final punctuation accepted; final 14/15; dashboard records completion. |
| Browser: 390px numerical | 10-question mixed-direction Numbers & Ordinals assessment: 10/10; perfect-review message; dashboard completion/mastery updated. AM/PM time conversion separately accepted. |
| Browser: Future builder | Required will/not tokens visible; missing will rejected; won't + base accepted without a final period. |
| Browser: navigation/locales/layout | Unfinished leave/continue, results return, restart confirmation, English/Vietnamese switch; 1280px, 390px and 320px checked. Detected 320px overflow corrected and retested. |
| Browser console | No application-origin console errors observed during the tested flows; unrelated extension errors excluded. |
| Repository hygiene | `git diff --check` passes. |

Initial failures/reproductions included wrong shared session, missing dashboard completion, `1th` acceptance, full-date rejection, malformed speech attribute and 320px overflow. They are recorded as findings above. No final automated test failures remain. Physical devices and the other explicitly listed limitations remain unverified.

## E. Final assessment

**Code quality / maintainability:** improved through small shared utilities, fewer conflicting write/render paths, removed verified dead code and documented ownership. Still a legacy layered implementation, not a modular rewrite.

**Stability / integrity:** tested first-answer scoring, mistake isolation, completion, navigation, malformed data and storage failure paths are more predictable. No known critical failure remains in the executed scenarios.

**Performance:** startup full-app replacements fell from 20 to 1 in the instrumented runtime. Hint computation is cached and stale callbacks cannot affect a new matching round. No unmeasured page-load, memory or device-speed claim is made.

**Educational accuracy:** the reviewed models/hints and tested equivalences pass, while meaning-changing grammar/time/punctuation cases are rejected. Kinship ambiguity, a few context-dependent prompts and broader natural paraphrases still require teacher judgment.

**Beta readiness:** suitable for controlled beta testing with these documented limitations. This is not a guarantee that every browser, device or possible answer is bug-free. The existing Wynnling Beta remains the maintained application.
