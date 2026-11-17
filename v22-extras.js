/* Wynnling v22 enhancement: complete reference lists and matching exercises. */
(function(){
"use strict";
const U=window.WynnlingV22;
if(!U)return;
const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const vietDays=["Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy","Chủ Nhật"];
const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
const v=()=>language==="vi";
const esc=x=>escapeHtml(String(x));
function guide(){
 let arr=[];
 if(session===0){
  arr=[...Array.from({length:20},(_,i)=>i+" — "+U.numWords(i)),...[20,30,40,50,60,70,80,90,100,1000].map(n=>n+" — "+U.numWords(n)),...Array.from({length:10},(_,i)=>(i+1)+" — "+U.ordinal(i+1))];
 }else if(session===1){
  arr=[...days.map((day,i)=>day+" — "+vietDays[i]),...months.map((m,i)=>m+" — Tháng "+(i+1))];
 }else if(session===2){
  arr=["07:00 — seven o'clock","07:05 — five past seven / seven oh five","07:15 — quarter past seven","07:30 — half past seven","07:45 — quarter to eight","07:50 — ten to eight","12:00 p.m. — noon","12:00 a.m. — midnight"];
 }else if(session===3){
  arr=["5,000 ₫ — five thousand dong","25,500 ₫ — twenty-five thousand five hundred dong","105,000 ₫ — one hundred and five thousand dong","1,250,000 ₫ — one million two hundred and fifty thousand dong","How much is it? — Bao nhiêu tiền?"];
 }else{
  arr=["What day is the appointment? — Cuộc hẹn vào thứ mấy?","What time does class start? — Lớp học bắt đầu lúc mấy giờ?","How much does it cost? — Giá bao nhiêu tiền?","When is your birthday? — Sinh nhật bạn vào ngày nào?"];
 }
 return '<details class="v22-guide"><summary>'+(v()?"Xem bảng kiến thức đầy đủ":"Full reference guide")+'</summary><div class="v22-ref-chips">'+arr.map(x=>'<span>'+esc(x)+'</span>').join("")+'</div>'+(session===1?'<p class="note">DD/MM/YYYY — '+(v()?"ngày/tháng/năm":"day/month/year")+'</p>':"")+'</details>';
}
let round=0,chosenLeft=null,chosenRight=null,done=new Set(),pairs=[];
function matchPairs(){
 const bank=U.banks[session],taken=bank.filter((_,i)=>i%3===round%3).slice(0,5);
 pairs=taken.map((q,i)=>{
  let word,number;
  if(q.kind==="day"){word=q.value;number=vietDays[days.indexOf(q.value)]}
  else if(q.kind==="month"){word=q.value;number="Tháng "+(months.indexOf(q.value)+1)}
  else if(q.kind==="ordinal"){word=U.ordinal(q.value);number=String(q.value)}
  else if(q.kind==="number"){word=U.numWords(q.value);number=q.value.toLocaleString("en-US")}
  else if(q.kind==="money"){word=U.numWords(q.value)+" dong";number=q.value.toLocaleString("en-US")+" ₫"}
  else if(q.kind==="time"){word=U.englishTime(q.hour,q.minute,"past");number=String(q.hour).padStart(2,"0")+":"+String(q.minute).padStart(2,"0")}
  else if(q.kind==="date"){word=months[q.month-1]+" "+U.ordinal(q.day);number=String(q.day).padStart(2,"0")+"/"+String(q.month).padStart(2,"0")+"/"+q.year}
  return {id:i,word,number};
 });
 chosenLeft=chosenRight=null;done=new Set();
}
function matching(){
 const ordered=[...pairs.slice(2),...pairs.slice(0,2)];
 const render=(p,side)=>'<button class="match-choice '+(done.has(p.id)?"matched":(side==="left"?chosenLeft:chosenRight)===p.id?"selected":"")+'" '+(done.has(p.id)?"disabled":"")+' onclick="v22MatchPick(\''+side+'\','+p.id+')">'+esc(p[side==="left"?"word":"number"])+'</button>';
 shell('<div class="practice v22"><button class="btn outline small" onclick="v22Hub()">← '+(v()?"Về buổi học":"Back to session")+'</button><h1>'+esc(U.sessionData[session].title)+' · '+(v()?"Nối cặp":"Matching")+'</h1><p class="v22-vn">'+esc(U.sessionData[session].vn)+'</p><p>'+(v()?"Nối cách đọc tiếng Anh với giá trị tương ứng.":"Match each English expression with the corresponding value.")+'</p><div class="card"><div class="row"><span class="tag">'+done.size+'/5</span><span class="muted">'+(v()?"Lượt":"Round")+' '+(round+1)+'</span></div><div class="match-grid five" style="margin-top:15px"><div class="match-column">'+pairs.map(p=>render(p,"left")).join("")+'</div><div class="match-column">'+ordered.map(p=>render(p,"right")).join("")+'</div></div>'+(done.size===5?'<div class="actions" style="margin-top:15px"><button class="btn" onclick="v22MatchNext()">'+(v()?"Lượt tiếp theo":"Next round")+' →</button><button class="btn secondary" onclick="v22Hub()">'+(v()?"Hoàn thành":"Finish")+'</button></div>':"")+'</div></div>');
}
window.v22MatchStart=()=>{round=0;matchPairs();view="v22Matching";matching()};
window.v22MatchNext=()=>{round++;matchPairs();matching()};
window.v22MatchPick=(side,id)=>{
 if(done.has(id))return;
 if(side==="left")chosenLeft=id;else chosenRight=id;
 if(chosenLeft!==null&&chosenRight!==null){
  if(chosenLeft===chosenRight)done.add(id);
  chosenLeft=chosenRight=null;
 }
 matching();
};
function enhanceHub(){
 if(view!=="v22Hub")return;
 const sample=document.querySelector(".v22-samples");
 if(sample&&!document.querySelector(".v22-guide"))sample.insertAdjacentHTML("afterend",guide());
 const modes=document.querySelector(".v22-mode-grid");
 if(modes&&!modes.querySelector(".v22-match-mode")){
  modes.insertAdjacentHTML("afterbegin",'<div class="card v22-match-mode"><h3>'+(v()?"Nối cặp":"Matching")+'</h3><p>'+(v()?"5 cặp mỗi lượt, luyện cách đọc và nhận diện số.":"Five pairs per round to practise recognition.")+'</p><button class="btn secondary" onclick="v22MatchStart()">'+(v()?"Bắt đầu":"Start")+' →</button></div>');
 }
}
const open=window.v22Open,hub=window.v22Hub;
window.v22Open=function(i){open(i);enhanceHub()};
window.v22Hub=function(){hub();enhanceHub()};
const previousGo=goSession;
goSession=function(ui,si){previousGo(ui,si);enhanceHub()};
const previousRender=render;
render=function(){if(view==="v22Matching")return matching();previousRender();enhanceHub()};
})();