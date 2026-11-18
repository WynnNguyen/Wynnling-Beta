// Compact subject-to-form rules for A1–A2 grammar reference cards.
const compactRules={
present:{
ordinaryAff:{en:'He/She/It; singular noun (1) → V(s/es)\nI/You/We/They; plural noun (≥2) → V₀',vi:'He/She/It; danh từ số ít (1) → V(s/es)\nI/You/We/They; danh từ số nhiều (≥2) → V₀'},
be:{en:'I → am\nHe/She/It; singular → is\nYou/We/They; plural → are',vi:'I → am\nHe/She/It; số ít → is\nYou/We/They; số nhiều → are'},
ordinaryNeg:{en:'I/You/We/They → don’t + V₀\nHe/She/It → doesn’t + V₀',vi:'I/You/We/They → don’t + V₀\nHe/She/It → doesn’t + V₀'},
yesno:{en:'Do + I/you/we/they + V₀?\nDoes + he/she/it + V₀?',vi:'Do + I/you/we/they + V₀?\nDoes + he/she/it + V₀?'},
wh:{en:'WH + do/does + S + V₀?',vi:'WH + do/does + S + V₀?'},
frequency:{en:'S + frequency adverb + ordinary verb\nS + be + frequency adverb',vi:'S + trạng từ tần suất + động từ thường\nS + be + trạng từ tần suất'}},
continuous:{
affirmative:{en:'S + am/is/are + V-ing',vi:'S + am/is/are + V-ing'},
negative:{en:'S + am/is/are + not + V-ing',vi:'S + am/is/are + not + V-ing'},
yesno:{en:'Am/Is/Are + S + V-ing?',vi:'Am/Is/Are + S + V-ing?'},
wh:{en:'WH + am/is/are + S + V-ing?',vi:'WH + am/is/are + S + V-ing?'}},
future:{
affirmative:{en:'All subjects → will + V₀',vi:'Mọi chủ ngữ → will + V₀'},
negative:{en:'All subjects → will not (won’t) + V₀',vi:'Mọi chủ ngữ → will not (won’t) + V₀'},
yesno:{en:'Will + S + V₀?',vi:'Will + S + V₀?'},
wh:{en:'WH + will + S + V₀?',vi:'WH + will + S + V₀?'},
be:{en:'All subjects → will be + noun/adjective',vi:'Mọi chủ ngữ → will be + danh từ/tính từ'}}};
const compactRule=(tense,type)=>compactRules[tense]?.[type]?.[language]||'';
const olderGuide7=guide;
guide=function(){olderGuide7();document.querySelectorAll('.formula-card').forEach((card,i)=>{const type=tenseGuides[drillTense].types[i]?.[0],note=card.querySelector('.concept-note');if(note)note.textContent=compactRule(drillTense,type)})};
const olderSessionHub7=sessionHub;
sessionHub=function(){olderSessionHub7();const note=document.querySelector('.session-focus .card:nth-child(2) .note');const tense=units[unit].id;if(note){const types=sessionFocus[tense][session];note.textContent=types.map(type=>compactRule(tense,type)).join('\n');note.classList.add('grammar-short')}};
