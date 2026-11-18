const assert=require('node:assert/strict'),fs=require('node:fs');
const {ctx,run,app,read}=require('./runtime.cjs');
const grade=ctx.WynnlingV21.grade,units=run('units');
assert.match(read('index.html'),/<title>Wynnling Beta<\/title>/);
const baseline=JSON.parse(read('tests/vocabulary-baseline.json'));
for(const [ui,u]of units.entries())for(const [si,s]of u.sessions.entries())for(const [wi,word]of baseline[ui][si].entries())assert.equal(s.words[wi][0],word,'Preserve vocabulary index '+[ui,si,wi]);
let translations=0,words=0,long=0,hintTotal=0;
for(const unit of units)for(const [si,session]of unit.sessions.entries()){
 words+=session.words.length;
 for(const dir of ['vi','en'])for(const pair of session[dir==='vi'?'v3vn':'v3en']){
  translations++;const item={dir,prompt:pair[0],model:pair[1]},en=dir==='vi'?pair[1]:pair[0];
  assert.doesNotMatch(pair.join(' '),/không đang|\b(?:write|writes|writing|wrote|written)\s+(?:(?:my|your|his|her|our|their|the)\s+)?homework\b/);
  const hints=ctx.WynnlingContent.hints(item,session.words);hintTotal+=hints.length;
  assert.ok(hints.length>=1&&hints.length<=4,`${unit.id}/${si}: ${en}`);
  if(en.split(' ').length>=12){long++;assert.ok(hints.length>=3,en)}
  for(const hint of hints){
   assert.ok(Number.isInteger(hint.bankIndex)&&session.words[hint.bankIndex],en);
   assert.ok(ctx.WynnlingContent.candidates(item,session.words).some(h=>h.english===hint.english&&h.bankIndex===hint.bankIndex),en);
   assert.ok(!['i','you','he','she','it','we','they','will','do','does','am','is','are','not'].includes(hint.english.toLowerCase()),hint.english);
   assert.notEqual(hint.english.toLowerCase(),en.toLowerCase());
  }
 }
}
assert.equal(translations,240);assert.equal(units.flatMap(u=>u.sessions).length,21);
// Exercise-specific lexical help: inflections and possessives should find the taught expression.
const fixture=[['help','giúp','v'],['homework','bài tập về nhà','n'],['afternoon','buổi chiều','n']];
const hints=ctx.WynnlingContent.hints({dir:'vi',model:'She often helps her younger brother do his homework in the afternoon.'},fixture);
assert.deepEqual(Array.from(hints,h=>h.english),['help','homework','afternoon']);
const possessive=ctx.WynnlingContent.hints({dir:'vi',model:'Are you doing your homework?'},[['do homework','làm bài tập về nhà','phr']]);assert.equal(possessive[0].english,'do homework');
// Correct homework conjugations, contractions and genuine writing tasks.
for(const model of ['I do my homework every day.','She is doing her homework.','He will do his homework tonight.','She does not do her homework on Sundays.','She writes an essay.','He is writing a paragraph.','They will write the answers.'])assert.equal(grade({dir:'vi',model},model).status,'correct',model);
assert.equal(grade({dir:'vi',model:'She does not do her homework on Sundays.'},"She doesn't do her homework on Sundays.").status,'correct');
for(const [model,answer]of [['I do homework every day.','I write homework every day.'],['She is doing homework.','She is writing homework.'],['He will do homework tonight.','He will write homework tonight.']])assert.equal(grade({dir:'vi',model},answer).code,'homework');
assert.equal(grade({dir:'vi',model:'She is doing her homework.'},'She is do her homework.').status,'wrong');
const ongoing={dir:'en',prompt:'She is not studying right now.',model:'Hiện giờ cô ấy không học bài.'};
for(const answer of ['Cô ấy đang không học bài lúc này.','Cô ấy hiện không học bài.','Cô ấy không học bài lúc này.'])assert.equal(grade(ongoing,answer).status,'correct',answer);
assert.equal(grade(ongoing,'Ngày mai cô ấy không học bài.').status,'wrong');
// All instructional dictionaries survive language switching; English and Vietnamese content remain paired.
run("language='vi';render()");assert.equal(run('units[1].name'),'Thì hiện tại tiếp diễn');assert.match(run("compactRules.continuous.negative.vi"),/Hiện giờ/);assert.doesNotMatch(JSON.stringify(run('grammarWordMeanings')),/không đang/);
ctx.v22Open(0);ctx.v22Begin('assessment');assert.match(app.innerHTML,/Viết|Nhập/);
run("language='en';render()");assert.equal(run('units[1].name'),'Present Continuous');assert.equal(run('units[2].sessions[0].name'),'Plans & tomorrow');
// The original source pack is retained, including all six 28-entry base vocabulary banks.
const src=read('present-simple-v20.js'),pack=JSON.parse(src.slice(src.lastIndexOf('})([')+3,-3));assert.equal(pack.length,6);for(const p of pack){assert.equal(p.words.length,28);assert.equal(p.grammar.length,15);assert.equal(p.translations.length,15);for(const q of p.translations)assert.ok(q.hints.length)}
console.log(`Content quality passed: ${translations} bilingual questions, ${words} vocabulary entries, ${hintTotal} lesson-scoped hints, ${long} longer sentences; homework forms, ongoing negatives, retained banks and both UI languages.`);
