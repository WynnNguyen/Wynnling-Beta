// Correct answers need confirmation, not redundant explanations.
// Incorrect answers get the specific construction that resolves the error.
const whCorrections={
present:[
['Where + do + you + live?','Where + do + you + V₀?'],
['When + does + she + go?','When + does + she + V₀? (not goes)'],
['Why + do + they + study?','Why + do + they + V₀?'],
['How + does + he + go?','How + does + he + V₀?'],
['What + do + you + do?','What + do + you + V₀?']],
continuous:[
['What + is + she + doing?','What + is + she + V-ing?'],
['Where + are + you + going?','Where + are + you + V-ing?'],
['Why + is + he + crying?','Why + is + he + V-ing?'],
['What + are + they + eating?','What + are + they + V-ing?'],
['Who + are + you + talking + to?','Who + are + you + V-ing + to?']],
future:[
['When + will + you + start?','When + will + S + V₀?'],
['Where + will + she + travel?','Where + will + S + V₀?'],
['Why + will + they + arrive?','Why + will + S + V₀?'],
['How long + will + you + stay?','How long + will + S + V₀?'],
['Where + will + we + meet?','Where + will + S + V₀?']]};
function targetedGrammarNote(){if(drillType==='wh'){const [example,formula]=whCorrections[drillTense]?.[drillIndex]||[];if(drillTense==='continuous'&&drillIndex===4)return language==='vi'?'“Who” là tân ngữ của “talk to”, nên giữ “to” ở cuối.\n'+formula:'“Who” is the object of “talk to”, so keep “to” at the end.\n'+formula;return `${formula}\n${example}`}if(drillType==='ordinaryAff'){const item=grammarItems.present.ordinaryAff[drillIndex];const subjectSingular=/^(She|He|My father)/.test(item[0]);return subjectSingular?(language==='vi'?'Chủ ngữ ngôi thứ ba số ít → V(s/es).':'Third-person singular → V(s/es).'):(language==='vi'?'I/We/You/They → V₀.':'I/We/You/They → V₀.')}return compactRule(drillTense,drillType)}
const priorDrill11=drill;
drill=function(){priorDrill11();if(!drillChecked)return;const note=document.querySelector('.drill-note');if(!note)return;const correct=drillAnswers[drillAnswers.length-1]?.correct;if(correct){note.remove();return}const text=note.querySelector('p');if(text){text.textContent=targetedGrammarNote();text.style.whiteSpace='pre-line';text.style.fontWeight='600'}};
render();
