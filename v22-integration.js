/* Integrates v22 behavior with the existing lesson engines and layouts. */
(function(){
'use strict';
const A=window.WynnlingAttempts,E=escapeHtml;
// Keep a single attempt order. Selecting an answer never regenerates questions.
let deck=null;
const oldQuestions=questionList;
questionList=function(){if(deck)return deck;if(mode!=="test")return oldQuestions();return units[unit].sessions.flatMap(source=>[...source.v3vn.slice(0,2).map(([prompt,model])=>({source,dir:"vi",prompt,model,answers:[model]})),...source.v3en.slice(0,2).map(([prompt,model])=>({source,dir:"en",prompt,model,answers:[model]}))])};
const oldStart=start;
start=function(u,s,m){deck=null;if(u!==0&&units[u]?.id!=='everyday'){const ui=u,si=s,md=m;A.begin({restart:()=>start(ui,si,md)});oldStart(u,s,m);deck=shuffle(questionList());practice();return}return oldStart(u,s,m)};
check=function(){if(checked||!answer.trim())return;const x=questionList()[q],key=mode==='test'?'test':`${unit}-${session}`;
 const result=WynnlingV21.grade(x,answer,language),ok=result.status==='correct';
 history[key]??={attempts:0,correct:0,assisted:0};history[key].attempts++;if(ok)history[key].correct++;if(formula||vocab||audio)history[key].assisted++;save();
 A.record(q,x,answer,ok,a=>WynnlingV21.grade(x,a,language).status==='correct');checked=true;practice();
};
const oldPractice=practice;
practice=function(){oldPractice();if(!checked||unit===0)return;const x=questionList()[q],r=WynnlingV21.grade(x,answer,language),box=document.querySelector('.practice .feedback');if(box)box.innerHTML=`<strong>${E(r.category)}</strong><p>${E(r.message)}</p><p>${E(x.model)}</p>`;};
next=function(){if(!checked)return;if(q<questionList().length-1){q++;answer='';checked=false;formula=vocab=audio=false;practice()}else{const key=mode==='test'?'test':`${unit}-${session}`;history[key].complete=true;save();A.finish()}};
// Legacy grammar drills and vocabulary quizzes use the same immutable first-submission ledger.
const oldStartDrill=startDrill;
startDrill=function(tense,type){A.begin({restart:()=>startDrill(tense,type)});oldStartDrill(tense,type)};
const oldDrill=drill;
drill=function(){if(drillIndex>=5)return A.finish();return oldDrill()};
checkDrill=function(){if(drillChecked||!answer.trim())return;const item=grammarItems[drillTense][drillType][drillIndex],correct=grammarAnswerCorrect(item,answer);
 drillAnswers.push({answer,correct});A.record(drillIndex,{prompt:item[0],model:item[1]},answer,correct,x=>grammarAnswerCorrect(item,x),drillType==='frequency'?frequencyOptions:[]);drillChecked=true;drill();};
const oldStartVocab=startVocabQuiz;
startVocabQuiz=function(u,s){A.begin({restart:()=>startVocabQuiz(u,s)});oldStartVocab(u,s)};
const oldQuiz=vocabQuiz;
vocabQuiz=function(){if(quizIndex>=quizDeck.length){const score=quizResults.filter(Boolean).length;updateVocabRecord({quizBest:Math.max(score,vocabRecord().quizBest||0)});return A.finish()}oldQuiz();document.querySelectorAll('.quiz-choice').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('selected'))))};
checkVocabQuiz=function(){if(quizChecked||!quizAnswer.trim())return;const word=current().words[quizDeck[quizIndex]],expected=word[0],easy=quizIndex<5;
 const correct=easy?quizAnswer===expected:WynnlingV21.basic(quizAnswer)===WynnlingV21.basic(expected);
 recordWordReview(unit,session,quizDeck[quizIndex],correct,quizIndex<8);quizResults.push(correct);A.record(quizIndex,{prompt:word[1],model:expected},quizAnswer,correct,x=>easy?x===expected:WynnlingV21.basic(x)===WynnlingV21.basic(expected),quizChoiceCache[quizIndex]||[]);quizChecked=true;vocabQuiz();};
// Use the taught expression in every translation model. Short form remains an approved equivalent.
for(const u of units)for(const lesson of u.sessions){
 const pool=(lesson.words||[]).some(w=>w[0].toLowerCase()==='swimming pool');
 if(pool)for(const key of ['v3vn','v3en'])for(const pair of lesson[key]||[]){const index=key==='v3vn'?1:0;pair[index]=pair[index].replace(/\b(?<!swimming )pool\b/gi,'swimming pool')}
}
// Word hints are lexical help, never a hidden rewrite of the model sentence.
const oldHints=wordHintsFor;
wordHintsFor=function(x){return oldHints(x).filter(w=>!['will','do','does','am','is','are','the','a','i','you','she','he','we','they'].includes(w[0].toLowerCase()))};
// Sentence building is grammar practice. All tokens come from that session's existing model.
let build=null;
function building(){
 view='v22Building';const item=build.deck[build.index];if(!item)return A.finish();
 shell(`<div class="practice"><h1>${language==='vi'?'Sắp xếp câu tương lai đơn':'Future Simple sentence building'}</h1><p>${build.index+1}/${build.deck.length}</p><div class="card"><h2>${E(item.prompt)}</h2><div class="words">${item.tokens.map(w=>`<span class="word">${E(w)}</span>`).join(' / ')}</div><label for="buildingAnswer">${language==='vi'?'Viết câu hoàn chỉnh':'Write the complete sentence'}</label><textarea id="buildingAnswer" class="answer" ${build.checked?'disabled':''} oninput="WynnlingBuild.input(this.value)">${E(build.answer)}</textarea><button class="btn" ${build.checked?'disabled':''} onclick="WynnlingBuild.check()">${t('check')}</button>${build.checked?`<div class="feedback ${build.ok?'':'review'}"><p>${E(build.feedback)}</p><b>${E(item.model)}</b></div><button class="btn" onclick="WynnlingBuild.next()">${t('nextSentence')} →</button>`:''}<button class="btn outline" onclick="navigate('curriculum')">${t('back')}</button></div></div>`);
}
window.WynnlingBuild={start(u,s){const lesson=units[u].sessions[s];const questions=lesson.v3vn.map(([prompt,model])=>({prompt,model,dir:'vi',tokens:shuffle(WynnlingV21.basic(model).split(' '))})).filter(x=>/\bwill\b/.test(x.tokens.join(' ')));unit=u;session=s;A.begin({restart:()=>WynnlingBuild.start(u,s)});build={deck:shuffle(questions),index:0,answer:'',checked:false};building()},input(x){if(!build.checked)build.answer=x},check(){if(build.checked||!build.answer.trim())return;const item=build.deck[build.index],r=WynnlingV21.grade(item,build.answer,language);build.checked=true;build.ok=r.status==='correct';build.feedback=r.message;A.record(build.index,item,build.answer,build.ok,x=>WynnlingV21.grade(item,x,language).status==='correct');building()},next(){if(!build.checked)return;build.index++;build.answer='';build.checked=false;building()}};
const oldHub=sessionHub;
sessionHub=function(){oldHub();if(units[unit].id==='future'){const main=document.querySelector('main');const button=document.createElement('button');button.className='btn secondary';button.textContent=language==='vi'?'Sắp xếp câu với will':'Build sentences with will';button.onclick=()=>WynnlingBuild.start(unit,session);main.append(button)}};
const oldRender=render;
render=function(){if(['v22Results','v22Mistakes'].includes(view))return A.render();if(view==='v22Building')return building();oldRender()};
// Consistent selected-state styling without altering the existing palette or layout.
const style=document.createElement('style');style.textContent='.vocab-check-choices .selected{background:#315f9f;color:white;border-color:#315f9f}.vocab-check-choices button,.quiz-choice{touch-action:manipulation;min-height:44px}#wynnling-confirm{border:1px solid #b5c9e8;border-radius:16px;padding:24px;max-width:min(440px,90vw);color:#203f70}#wynnling-confirm::backdrop{background:#132b4c70}';document.head.append(style);
render();
})();
