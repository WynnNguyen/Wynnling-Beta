# Wynnling Beta v22

Integrated into the existing GitHub Pages application. All 21 sessions and the existing vocabulary and translation databases remain available. No hosting or access settings were changed.

## Changes

- Vocabulary MCQs redraw from retained answer state, expose pressed state, and keep checking separate from selection.
- Approved translation equivalences cover contractions, meal expressions, TV/television, normally/usually, and pool/swimming pool without collapsing habitual and specific time expressions.
- Formatting tolerance preserves word order and clause punctuation. Unknown paraphrases do not receive automatic credit.
- Immutable first-submission results and separate mistake review cover vocabulary, grammar, translation, and numerical exercises. Duplicate checks cannot add scores.
- Results offer mistake review, confirmed restart, and return to lessons. Unfinished attempts have a cancelable exit warning.
- Future sentence-building uses shuffled tokens from existing lesson sentences, including will and not where required. The student must supply the complete sentence.
- Cumulative tests use the selected unit. Translation decks stay stable within an attempt and shuffle between attempts.
- Swimming pool models follow their taught vocabulary; exam wording is aligned with examination hints.
- Number and money generation spans nine place-value bands from zero through 999,999,999. Invalid decimal/grouping formats and larger values are rejected.
- Numerical matching now uses the actual question generator instead of an undefined bank.

## Automated validation

Run:

```
node tests/regression.cjs
node tests/v22.cjs
node tests/application.cjs
```

The suite checks script syntax, retained lesson counts, all 240 translation models, core exercise completion and duplicate submissions, cumulative unit scope, matching, 25 semantic acceptance/rejection cases, numerical boundary cases, all nine numerical lengths, 9,000 generated items, and immutable scores during mistake review.

## Browser checks

Verified MCQ selection/change/submission, a complete ten-question vocabulary attempt, previous-answer display in mistake review, correct review submission with unchanged original score, alternate translation acceptance, disabled submitted inputs, and exit/restart dialog rendering.

## Limits

Translation grading uses explicitly approved equivalences, not an unrestricted semantic model. Other valid paraphrases may still need additional approved answers. Desktop browser checks and touch-friendly controls do not replace physical iOS/Android device testing. Audio voices depend on the browser/device.
