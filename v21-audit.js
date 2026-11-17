/* Wynnling v21 | Content audit and legacy review UI. */
(function(){
"use strict";
function runAudit(){
 const issues=[],stats={sessions:0,questions:0,grammar:0,words:0,issues};
 const valid=new Set(["n","v","adj","adv","phr","pron","prep","conj"]);
 units.forEach((u,ui)=>u.sessions.forEach((s,si)=>{
  stats.sessions++;stats.words+=(s.words||[]).length;
  const vn=s.v3vn||[],en=s.v3en||[];
  stats.questions+=vn.length+en.length;
  if(u.id!=="everyday"&&(vn.length!==10||en.length!==5))issues.push({kind:"question-count",tense:u.id,session:si+1,vn:vn.length,en:en.length});
  const words=new Set();
  for(const w of s.words||[]){
   if(!valid.has(w[2]))issues.push({kind:"word-class",session:s.name,word:w[0],pos:w[2]});
   if(w[2]==="v"&&/\s/.test(w[0]))issues.push({kind:"phrase-as-verb",session:s.name,word:w[0]});
   const key=w[0].toLowerCase()+"|"+w[2];
   if(words.has(key))issues.push({kind:"duplicate",session:s.name,word:w[0]});
   words.add(key);
  }
  for(const [direction,pairs] of [["vn",vn],["en",en]]){
   pairs.forEach((p,i)=>{
    if(!Array.isArray(p)||!p[0]||!p[1])issues.push({kind:"empty-translation",session:s.name,direction,index:i});
   });
  }
 }));
 stats.ok=!issues.length;
 return stats;
}
window.WynnlingV21.runAudit=runAudit;
const prevPractice=practice;
practice=function(){
 prevPractice();
 if(unit===0||!checked||view!=="practice")return;
 const item=questionList()[q];if(!item)return;
 const result=window.WynnlingV21.grade({...item,rubric:{targetTense:units[unit].id==="continuous"?"present-continuous":"future-simple"}},answer,language);
 const panel=document.querySelector(".practice .feedback");
 if(!panel)return;
 if(result.status==="review"){
  panel.classList.add("review");panel.style.background="#fff8e9";panel.style.borderColor="#e9d8ae";
  const heading=panel.querySelector("strong");
  if(heading)heading.textContent=language==="vi"?"◇ Cần giáo viên xem lại":"◇ Needs review";
  const note=document.createElement("p");
  note.className="v21-review-note";note.textContent=result.message;
  panel.prepend(note);
  const input=document.querySelector(".practice .answer");if(input){input.classList.remove("is-wrong");input.style.borderColor="#d7b771"}
 }else if(result.status==="correct"){
  const heading=panel.querySelector("strong");if(heading)heading.textContent=language==="vi"?"✓ Đúng":"✓ Accepted";
 }
};
const report=runAudit();
console.info("Wynnling v21 content audit",report);
})();