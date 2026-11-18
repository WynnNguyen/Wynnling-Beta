# Wynnling Beta — Vietnamese and educational content review

The site name is **Wynnling Beta**. This update applies to the existing GitHub Pages application and preserves its layout, four units, 21 sessions, and 240 translation questions.

## Review coverage

| Unit | Content reviewed |
| --- | --- |
| Present Simple | Six vocabulary banks, 90 translation pairs, 90 grammar questions, vocabulary tests, hints, grammar explanations and feedback |
| Present Continuous | Five session banks, 75 translation pairs, grammar rules and examples, questions and negative forms |
| Future Simple | Five session banks, 75 translation pairs, auxiliary rules, negative/question structures, sentence building and time references |
| Numbers, Dates & Time | Five session banks, number/date/time/money instructions, examples, definitions, matching, listening and assessment wording |
| Shared interface | Vietnamese navigation, session titles, progress terms, feedback, results and restart/exit dialogs |

Negative sentences were reviewed in context. For example, “She is not listening to music” now has the natural model “Hiện giờ cô ấy không nghe nhạc.” This does not depend on blindly moving the word “đang.” Sentence-specific current-time variants such as “Cô ấy đang không nghe nhạc” are accepted without treating tomorrow or today as equivalent to now.

General homework activity uses **do homework**, including does/doing/will do as required. Writing a paragraph, writing an essay, writing answers and the standalone word write remain unchanged. Incorrect write-homework answers receive an explanation.

Definitions and time wording were also reviewed: nearby is “gần đó,” get dressed is “mặc quần áo,” and this evening remains distinct from a habitual evening. Unit 04 instructions explain the required date, time and numerical input formats.

## Hint coverage and vocabulary preservation

- All 240 translation questions have optional lesson-scoped lexical hints: 493 hints in the reviewed bank.
- Hints recognize inflections and possessives such as helps, studies and doing your homework.
- Longer sentences (12 or more English words) receive at least three relevant hints; the maximum is four.
- Subjects, pronouns, auxiliaries and complete sentence structures are not supplied as hints.
- The 447 original vocabulary entries retain their original English text, lesson and index. Their Vietnamese definitions can be corrected without disturbing progress keys.
- 41 supplementary entries, already used by the existing lesson sentences, are appended to their respective banks. The total is 488 entries. No unrelated vocabulary is introduced for hint generation.
- The original six 28-entry Present Simple source banks and all question IDs remain intact; supplementary words are appended during installation.

## Validation

```
node tests/regression.cjs
node tests/v22.cjs
node tests/application.cjs
node tests/content-quality.cjs
```

All pass. Tests cover the original vocabulary indices, question/session counts, lesson membership and relevance of hints, hint limits, do-homework conjugations and contractions, legitimate writing tasks, natural Vietnamese ongoing negatives, temporal distinctions, both UI languages and the four exercise engines.

Browser checks cover the Vietnamese navigation, vocabulary definitions, optional hints, corrected negative prompts, accepted English answers and localized feedback. Physical iOS/Android testing has not been performed.

Vietnamese translation grading still uses approved equivalents. This review does not claim that every possible Vietnamese paraphrase is recognized.
