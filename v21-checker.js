/* Wynnling v21 | Shared answer evaluator. Browser-local; unknown paraphrases need human review. */
(function(){
"use strict";
const aliases=[
[/\beats breakfast\b/g,"has breakfast"],[/\beat breakfast\b/g,"have breakfast"],[/\beating breakfast\b/g,"having breakfast"],
[/\bgets up\b/g,"wakes up"],[/\bget up\b/g,"wake up"],[/\bgetting up\b/g,"waking up"],
[/\belder sister\b/g,"older sister"],[/\belder brother\b/g,"older brother"],[/\blittle sister\b/g,"younger sister"],[/\blittle brother\b/g,"younger brother"],
[/\bmom\b|\bmum\b/g,"mother"],[/\bdad\b/g,"father"],

[/\bgoes shopping\b/g,"shops"],[/\bgo shopping\b/g,"shop"],
[/\bevery sunday\b|\bon sundays\b/g,"on sundays"],[/\bat university\b/g,"in university"],[/\bexams\b/g,"examinations"],[/\bexam\b/g,"examination"]
];
const contracted=[[/\bdoesn't\b/g,"does not"],[/\bdon't\b/g,"do not"],[/\bisn't\b/g,"is not"],[/\baren't\b/g,"are not"],[/\bwon't\b/g,"will not"],[/\bcan't\b/g,"cannot"],[/\bi'm\b/g,"i am"],[/\bhe's\b/g,"he is"],[/\bshe's\b/g,"she is"],[/\bthey're\b/g,"they are"],[/\bwe're\b/g,"we are"],[/\bit's\b/g,"it is"]];
const nums={one:"1",two:"2",three:"3",four:"4",five:"5",six:"6",seven:"7",eight:"8",nine:"9",ten:"10",eleven:"11",twelve:"12"};
const vietnamese=[[/\bthường xuyên\b/g,"thường"],[/\bhay\b/g,"thường"],[/\bcha\b|\bba\b/g,"bố"],[/\bmá\b/g,"mẹ"],[/\bkì thi\b/g,"kỳ thi"],[/\bôn tập\b/g,"ôn bài"],[/\bhằng ngày\b/g,"mỗi ngày"]];
function clean(s){return String(s||"").toLowerCase().normalize("NFC").replace(/[’‘]/g,"'").replace(/[.,!?;:()“”"]/g," ").replace(/\s+/g," ").trim()}
function normal(s,vi=false){
 let x=" "+clean(s)+" ";const ops=vi?vietnamese:[...contracted,...aliases];
 for(const [a,b] of ops)x=x.replace(a,b);
 if(!vi){
  x=x.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/g,m=>nums[m]);
  x=x.replace(/\b(\d{1,2})\s+o'clock\b/g,"$1");
  x=x.replace(/\bat (\d{1,2}) in the morning\b/g,"at $1");
 }
 return x.replace(/\s+/g," ").trim();
}
function negative(s,vi){return vi?/(?:^|\s)(?:không|chẳng|chưa|đừng|chả)(?:\s|$)/.test(s):/\b(?:not|never|cannot)\b/.test(s)}
function badAgreement(s){
 // First reject simple subject/auxiliary errors, then affirmative base verbs after singular subjects.
 const singular="(?:he|she|it|(?:my|your|his|her|the)\\s+(?:(?:older|younger|elder|little|big)\\s+)?(?:sister|brother|father|mother|teacher|friend|manager|colleague|company))";
 const verb="(?:have|eat|wake|get|go|do|play|work|read|watch|study|enjoy|brush|help|prepare|finish|visit|like|feel|prefer|collect|spend|live|care|listen|earn|deliver|manage|write|cook|run|swim|train|wait|buy|walk|order|travel|arrive|stay|start|join|come|bring|pass|improve|rain|hope|understand|respect|believe|share|agree|worry)";
 const adverbs="(?:(?:always|usually|often|rarely|sometimes|never)\\s+)?";
 if(new RegExp("\\b"+singular+"\\s+"+adverbs+"(?:don't|do not)\\b").test(s))return"doDoes";
 if(/\b(?:i|you|we|they|my parents|our colleagues)\s+(?:(?:always|usually|often|rarely|sometimes)\s+)?(?:doesn't|does not)\b/.test(s))return"doDoes";
 if(new RegExp("\\b"+singular+"\\s+"+adverbs+verb+"\\b").test(s))return"thirdPerson";
 if(/\b(?:he|she|it)\s+(?:am|are)\b|\bi\s+(?:is|are)\b/.test(s))return"beAgreement";
 if(/\b(?:does|doesn't|does not|do|don't|do not)\s+(?:goes|wakes|eats|has|plays|works|studies|likes|watches|does|reads|prepares|enjoys|visits)\b/.test(s))return"baseAfterAux";
 return"";
}
const messages={
 en:{correct:"Equivalent meaning and grammar accepted.",review:"This may be a valid alternative. Compare it with the model or ask your teacher to review it.",polarity:"The negative meaning has changed.",agreement:"Check the subject, auxiliary, and verb form.",tense:"Check the requested tense and verb form.",question:"Keep the question form and word order.",subject:"Check who performs the action."},
 vi:{correct:"Đã chấp nhận cách diễn đạt tương đương.",review:"Cách dịch này có thể đúng. Hãy đối chiếu đáp án hoặc nhờ giáo viên kiểm tra.",polarity:"Ý phủ định của câu đã thay đổi.",agreement:"Kiểm tra chủ ngữ, trợ động từ và dạng động từ.",tense:"Kiểm tra thì và dạng động từ.",question:"Kiểm tra dạng câu hỏi và trật tự từ.",subject:"Kiểm tra chủ thể thực hiện hành động."}
};
function grade(item,response,uiLang="en"){
 const msg=messages[uiLang==="vi"?"vi":"en"];
 const isVi=(item.dir==="en"||item.dir==="en-vi");
 const given=normal(response,isVi),model=normal(item.model,isVi);
 const result=(status,code)=>({status,code,reason:msg[code]||msg.review,message:msg[code]||msg.review,confidence:status==="correct"?1:0});
 if(!given)return result("wrong","review");
 if(given===model)return result("correct","correct");
 if(negative(model,isVi)!==negative(given,isVi))return result("wrong","polarity");
 if(!isVi){
  // Unambiguous agreement errors reject even when the meaning is otherwise right.
  if(badAgreement(clean(response)))return result("wrong","agreement");
  const tense=(item.rubric&&item.rubric.targetTense)||item.tense||"";
  if(/continuous/.test(tense)&&!/\b(?:am|is|are)\s+(?:not\s+)?\w+ing\b/.test(given)&&/\b(?:am|is|are)\s+\w+ing\b/.test(model))return result("wrong","tense");
  if(/future/.test(tense)&&/\bwill\b/.test(model)&&!/\bwill\b/.test(given))return result("review","tense"); // alternate futures can be valid
  if(/^\s*(?:do|does|will|am|is|are|what|where|when|why|how|who)\b/.test(model)!==/^\s*(?:do|does|will|am|is|are|what|where|when|why|how|who)\b/.test(given))return result("review","question");
 }
 const approved=[...(item.accepted||[]),...(item.answers||[])];
 if(approved.some(a=>normal(a,isVi)===given))return result("correct","correct");
 // Similar strings are NOT automatically graded correct; uncertain semantic alternatives need review.
 return result("review","review");
}
window.WynnlingV21={version:"21.1",grade,normalize:normal};
})();