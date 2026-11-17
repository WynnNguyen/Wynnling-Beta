/* Wynnling v22 — Numbers, Dates & Time. Independent unit data and structured assessment. */
(function(){
"use strict";
const V={en:{name:"Numbers, Dates & Time",sub:"Numbers · dates · clocks · prices",intro:"Practise reading, writing and listening to everyday English.",learn:"Learn",practice:"Practice",listen:"Listen",test:"Assessment",questions:"questions",start:"Start",back:"Back to learning units",again:"Try again",check:"Check answer",next:"Next question",finish:"Finish",answer:"Your answer",result:"Result",correct:"Correct!",wrong:"Not quite",reference:"Model answer",note:"Use the format requested in each question.",ready:"Study the examples, then practise with new values.",unit:"Unit 04",final:"Mixed Practice",score:"Correct answers",normal:"Normal speed",slow:"Slow speed",all:"All learning units",num:"Numbers & Ordinals",date:"Days, Months & Dates",time:"Telling Time",money:"Money & Prices",mix:"Mixed Practice",prompt:"Type your answer",review:"Review the example and try again.",clock:"What time is shown?",go:"Open session"},
vi:{name:"Numbers, Dates & Time",sub:"Số đếm · ngày tháng · giờ giấc · tiền tệ",intro:"Luyện đọc, viết và nghe các con số thường gặp.",learn:"Học kiến thức",practice:"Luyện tập",listen:"Luyện nghe",test:"Kiểm tra",questions:"câu",start:"Bắt đầu",back:"Về lộ trình học",again:"Làm lại",check:"Kiểm tra",next:"Câu tiếp theo",finish:"Hoàn thành",answer:"Câu trả lời",result:"Kết quả",correct:"Chính xác!",wrong:"Chưa đúng",reference:"Đáp án mẫu",note:"Nhập câu trả lời theo yêu cầu của câu hỏi.",ready:"Xem ví dụ, sau đó luyện tập với các giá trị khác nhau.",unit:"Bài 04",final:"Luyện tập tổng hợp",score:"Số câu đúng",normal:"Tốc độ thường",slow:"Tốc độ chậm",all:"Tất cả các bài học",num:"Số đếm và số thứ tự",date:"Thứ, tháng và ngày",time:"Cách đọc giờ",money:"Tiền và giá cả",mix:"Luyện tập tổng hợp",prompt:"Nhập câu trả lời",review:"Xem đáp án mẫu rồi thử lại.",clock:"Đồng hồ hiển thị mấy giờ?",go:"Mở buổi học"}};
const tr=k=>V[language==="vi"?"vi":"en"][k]||k;
const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],months=["January","February","March","April","May","June","July","August","September","October","November","December"];
const small=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const tens=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function numWords(n){
 n=Number(n);if(!Number.isSafeInteger(n)||n<0||n>999999999999)return"";
 if(n<20)return small[n];if(n<100)return tens[Math.floor(n/10)]+(n%10?"-"+small[n%10]:"");
 if(n<1000)return small[Math.floor(n/100)]+" hundred"+(n%100?" and "+numWords(n%100):"");
 if(n<1e6)return numWords(Math.floor(n/1000))+" thousand"+(n%1000?(n%1000<100?" and ":" ")+numWords(n%1000):"");
 if(n<1e9)return numWords(Math.floor(n/1e6))+" million"+(n%1e6?" "+numWords(n%1e6):"");
 return numWords(Math.floor(n/1e9))+" billion"+(n%1e9?" "+numWords(n%1e9):"");
}
function ordinal(n){
 const irregular={1:"first",2:"second",3:"third",5:"fifth",8:"eighth",9:"ninth",12:"twelfth"};
 if(irregular[n])return irregular[n];
 const base=numWords(n);if(/twenty-|thirty-/.test(base)){const last=n%10;return numWords(n-last)+"-"+ordinal(last)}
 if(base.endsWith("y"))return base.slice(0,-1)+"ieth";
 if(base.endsWith("e"))return base.slice(0,-1)+"th";
 return base+"th";
}
function englishTime(h,m,style){
 const hour=h%12||12;
 if(style==="past"){if(m===0)return numWords(hour)+" o'clock";if(m===15)return"quarter past "+numWords(hour);if(m===30)return"half past "+numWords(hour);if(m===45)return"quarter to "+numWords((hour%12)+1);if(m<30)return numWords(m)+" past "+numWords(hour);return numWords(60-m)+" to "+numWords((hour%12)+1)}
 return numWords(hour)+(m===0?" o'clock":m<10?" oh "+numWords(m):" "+numWords(m));
}
function hhmm(h,m){return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")}
function fmtAmount(n){return n.toLocaleString("en-US")+" ₫"}
function strip(s){return String(s).toLowerCase().normalize("NFC").replace(/[’‘]/g,"'").replace(/[,₫.]/g," ").replace(/\s+/g," ").trim()}
function numeral(s){const v=String(s).trim().replace(/[\s,.₫đ]/g,"");return /^\d+$/.test(v)?Number(v):NaN}
function normalWords(s){return strip(s).replace(/\b(and)\b/g,"").replace(/-/g," ").replace(/\bdongs?\b/g,"dong").replace(/\s+/g," ").trim()}
function numericAnswer(q,entered){
 if(!entered.trim())return false;
 const raw=entered.trim();
 if(q.kind==="number"||q.kind==="money"){
  if(q.mode==="digits")return numeral(raw)===q.value;
  const n=normalWords(raw);
  const models=q.kind==="money"?[numWords(q.value)+" dong",numWords(q.value)+" vietnamese dong",numWords(q.value)+" vnd"]:[numWords(q.value)];
  return models.some(x=>normalWords(x)===n);
 }
 if(q.kind==="ordinal")return q.mode==="digits"?new RegExp("^"+q.value+"(?:st|nd|rd|th)?$","i").test(raw):normalWords(raw)===normalWords(ordinal(q.value));
 if(q.kind==="day"||q.kind==="month")return strip(raw)===strip(q.value);
 if(q.kind==="date"){
  if(q.mode==="words")return [q.model,months[q.month-1]+" "+ordinal(q.day),ordinal(q.day)+" "+months[q.month-1],months[q.month-1]+" "+q.day, q.day+" "+months[q.month-1]].some(x=>normalWords(x)===normalWords(raw));
  const p=raw.replace(/\s/g,"").match(/^(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{4}))?$/);
  return !!p&&+p[1]===q.day&&+p[2]===q.month&&(!p[3]||+p[3]===q.year);
 }
 if(q.kind==="time"){
  if(q.mode==="digits"){
   const x=raw.toLowerCase().replace(/\./g,"").replace(/\s+/g,"").match(/^(\d{1,2})[:.](\d{2})(am|pm)?$/);
   if(!x)return false;let h=+x[1];const m=+x[2];if(m!==q.minute||m>59)return false;
   if(x[3]){if(h<1||h>12)return false;h=h%12+(x[3]==="pm"?12:0)}
   // Accept either 24h display or an unambiguous explicitly specified 12h display.
   return h===q.hour||(q.allow12&&!x[3]&&h===(q.hour%12||12));
  }
  const modelSet=[englishTime(q.hour,q.minute),englishTime(q.hour,q.minute,"past")];
  if(q.minute===15||q.minute===45)modelSet.push("a "+englishTime(q.hour,q.minute,"past"));
  const x=normalWords(raw).replace(/^it s /,"").replace(/^it's /,"");
  return modelSet.some(m=>normalWords(m)===x);
 }
 return false;
}
const sessionData=[
{key:"num",title:"Numbers & Ordinals",vn:"Số đếm và số thứ tự",intro:"Numbers from zero to millions, and first/second/third.",vnIntro:"Số từ 0 đến hàng triệu và cách đọc số thứ tự.",samples:[["13 / 30","thirteen / thirty"],["105","one hundred and five"],["1,250","one thousand two hundred and fifty"],["21st","twenty-first"]],words:[["number","con số","n"],["hundred","trăm","n"],["thousand","nghìn","n"],["million","triệu","n"],["ordinal","số thứ tự","n"],["first","thứ nhất","adj"],["second","thứ hai","adj"],["third","thứ ba","adj"]]},
{key:"date",title:"Days, Months & Dates",vn:"Thứ, tháng và ngày",intro:"Weekdays, months, ordinal dates, and years.",vnIntro:"Thứ trong tuần, tháng, ngày và năm.",samples:[["Monday","Thứ Hai"],["November 17","November seventeenth"],["17/11/2026","17 November 2026 (day/month/year)"],["2026","twenty twenty-six"]],words:[["weekday","ngày trong tuần","n"],["month","tháng","n"],["date","ngày tháng","n"],["year","năm","n"],["birthday","sinh nhật","n"],["calendar","lịch","n"],["today","hôm nay","adv"],["tomorrow","ngày mai","adv"]]},
{key:"time",title:"Telling Time",vn:"Cách đọc giờ",intro:"Read digital times as hour + minutes first (7:20 = seven twenty), then learn past/to alternatives.",vnIntro:"Đọc kiểu giờ + phút trước (7:20 = seven twenty), sau đó học cách đọc past/to.",samples:[["07:00","seven o'clock"],["07:05","seven oh five / five past seven"],["07:20","seven twenty / twenty past seven"],["07:30","seven thirty / half past seven"],["07:45","seven forty-five / quarter to eight"],["07:50","seven fifty / ten to eight"]],words:[["clock","đồng hồ","n"],["hour","giờ","n"],["minute","phút","n"],["morning","buổi sáng","n"],["afternoon","buổi chiều","n"],["evening","buổi tối","n"],["early","sớm","adv"],["late","muộn","adj"]]},
{key:"money",title:"Money & Prices",vn:"Tiền và giá cả",intro:"Learn place values first: hundred, thousand, ten thousand, hundred thousand, million.",vnIntro:"Học các hàng số trước: trăm, nghìn, chục nghìn, trăm nghìn, triệu.",samples:[["100 ₫","one hundred dong"],["1,000 ₫","one thousand dong"],["10,000 ₫","ten thousand dong"],["100,000 ₫","one hundred thousand dong"],["1,000,000 ₫","one million dong"],["10,000,000 ₫","ten million dong"],["100,000,000 ₫","one hundred million dong"],["1,000,000,000 ₫","one billion dong"]],words:[["price","giá","n"],["discount","giảm giá","n"],["change","tiền thối","n"],["cash","tiền mặt","n"],["buy","mua","v"],["sell","bán","v"],["pay","trả tiền","v"],["cheap","rẻ","adj"],["expensive","đắt","adj"]]},
{key:"mix",title:"Mixed Practice",vn:"Luyện tập tổng hợp",intro:"Appointments, schedules, birthdays and shopping.",vnIntro:"Cuộc hẹn, lịch trình, sinh nhật và mua sắm.",samples:[["Appointment","Thursday, November nineteenth · 3:30 p.m."],["Shopping","Three hundred and twenty-five thousand dong"],["Class schedule","Monday · 8:45 a.m."],["Birthday","June twenty-first"]],words:[["appointment","cuộc hẹn","n"],["schedule","lịch trình","n"],["meeting","cuộc họp","n"],["ticket","vé","n"],["birthday","sinh nhật","n"],["shopping","việc mua sắm","n"],["start","bắt đầu","v"],["cost","có giá","v"]]}
];
const numberValues=[7,13,18,25,37,40,56,73,99,105,116,204,308,416,580,672,806,999,1005,1250,2026,3048,5070,12600,25080,100500,325000,1000000,1250000,2400500];
const dayRows=[...days,...days,...days,...days,...days].slice(0,30);
const dateSamples=[[17,11],[21,7],[3,4],[15,2],[1,1],[30,6],[12,8],[23,9],[5,12],[19,11],[14,3],[27,5],[31,10],[9,1],[25,12]];
const timeSamples=[[7,0],[7,5],[7,15],[7,30],[7,45],[7,50],[8,20],[9,30],[10,10],[11,55],[12,0],[12,30],[13,15],[14,45],[15,30],[16,5],[17,40],[18,0],[19,25],[20,50],[21,15],[22,30],[23,45],[0,0],[6,10],[6,55],[8,45],[9,5],[10,30],[16,50]];
const prices=[100,1000,10000,100000,1000000,10000000,100000000,1000000000,5000,12000,25500,105000,1250000,80000,325000,15000,39000,120500,7500,999000,205000,99000,127000,1500000,35000,190000,420000,50600,4500,675000];
function makeQuestions(i){
 let out=[];
 if(i===0)out=numberValues.map((n,j)=>({kind:j%5===0?"ordinal":"number",value:j%5===0?1+j%31:n,mode:j%2?"words":"digits"}));
 if(i===1)out=Array.from({length:30},(_,j)=>j%3===0?{kind:"day",value:days[j%7],mode:"words"}:j%3===1?{kind:"month",value:months[Math.floor(j/3)%12],mode:"words"}:(()=>{const [d,m]=dateSamples[j%dateSamples.length];return {kind:"date",day:d,month:m,year:2026,mode:j%2?"words":"digits"}})());
 if(i===2)out=timeSamples.map(([h,m],j)=>({kind:"time",hour:h,minute:m,mode:j%3===0?"words":"digits",allow12:false}));
 if(i===3)out=prices.map((v,j)=>({kind:"money",value:v,mode:j%2?"words":"digits"}));
 if(i===4){const b=[...makeQuestions(0).slice(0,6),...makeQuestions(1).slice(0,8),...makeQuestions(2).slice(0,8),...makeQuestions(3).slice(0,8)];out=b.map((q,j)=>({...q,scenario:["appointment","class timetable","birthday","shopping"][j%4]}))}
 return out.map((q,j)=>({...q,id:"U4-S"+(i+1)+"-Q"+String(j+1).padStart(2,"0"),session:i}));
}
const banks=sessionData.map((_,i)=>makeQuestions(i));
const unit4={id:"everyday",name:"Numbers, Dates & Time",sub:"Số đếm, ngày tháng và giờ giấc",emoji:"🔢",level:"A1–A2",sessions:sessionData.map((s,i)=>({name:s.title,focus:s.vn,words:s.words,formula:"Reading, listening & numerical comprehension",v3vn:[],v3en:[],questions:[]}))};
units.push(unit4);
sessionFocus.everyday=Array.from({length:5},()=>[]);
tenseGuides.everyday={title:unit4.name,uses:{en:[],vi:[]},types:[],signals:[]};
const uiIndex=units.length-1;
const state={session:0,stage:"hub",index:0,answered:false,input:"",correct:false,mode:"practice",deck:[],score:0};
const scoresKey="wynnling-v22-everyday-progress";
function progress(){try{return JSON.parse(localStorage.getItem(scoresKey)||"{}")}catch{return{}}}
function saveScore(){const data=progress(),key=state.mode==="assessment"?"assessment-"+state.session:state.session+"-"+state.mode;data[key]=Math.max(data[key]||0,state.score);localStorage.setItem(scoresKey,JSON.stringify(data))}
function d(s){return escapeHtml(String(s))}
function sampleRows(s){return s.samples.map(([a,b])=>'<div class="v22-sample"><strong>'+d(a)+'</strong><span>'+d(b)+'</span></div>').join("")}
function show(content){shell('<div class="practice v22"><div class="eyebrow">'+tr("unit")+' · '+tr("name")+'</div>'+content+'</div>')}
function hub(){
 const s=sessionData[state.session],p=progress();show('<button class="btn outline small" onclick="v22All()">← '+tr("back")+'</button><h1>'+d(s.title)+'</h1><p class="v22-vn">'+d(s.vn)+'</p><p>'+d(language==="vi"?s.vnIntro:s.intro)+'</p><div class="card"><h2>'+tr("learn")+'</h2><div class="v22-samples">'+sampleRows(s)+'</div><p class="note">'+tr("ready")+'</p></div><div class="v22-mode-grid"><div class="card"><h3>'+tr("practice")+'</h3><p>30 '+tr("questions")+' · '+tr("note")+'</p><button class="btn" onclick="v22Begin(\'practice\')">'+tr("start")+' →</button></div><div class="card"><h3>'+tr("listen")+'</h3><p>10 '+tr("questions")+' · '+(language==="vi"?"Nghe và nhập câu trả lời":"Listen and type the answer")+'</p><button class="btn secondary" onclick="v22Begin(\'listen\')">'+tr("start")+' →</button></div><div class="card"><h3>'+tr("test")+'</h3><p>'+(state.session===4?20:10)+' '+tr("questions")+' · '+tr("score")+': '+(p["assessment-"+state.session]??"—")+'</p><button class="btn outline" onclick="v22Begin(\'assessment\')">'+tr("start")+' →</button></div></div>');
}
function questionPrompt(q){
 if(state.mode==="listen")return language==="vi"?"Nghe âm thanh rồi nhập giá trị hoặc tên thứ/tháng được đọc.":"Listen and type the value or spoken day/month.";
 if(q.kind==="number")return q.mode==="digits"?(language==="vi"?"Viết số dưới đây bằng chữ số.":"Write the number in digits."):(language==="vi"?"Viết số dưới đây bằng tiếng Anh.":"Write this number in English.");
 if(q.kind==="ordinal")return q.mode==="digits"?(language==="vi"?"Viết số thứ tự dưới dạng số (1st, 2nd...).":"Write the ordinal in digits (1st, 2nd...)."):(language==="vi"?"Viết số thứ tự bằng tiếng Anh.":"Write the ordinal in words.");
 if(q.kind==="day")return language==="vi"?"Viết đúng tên thứ trong tuần.":"Write the weekday name.";
 if(q.kind==="month")return language==="vi"?"Viết đúng tên tháng.":"Write the month name.";
 if(q.kind==="date")return q.mode==="digits"?(language==="vi"?"Nhập ngày theo định dạng DD/MM/YYYY.":"Enter DD/MM/YYYY (day first)."):(language==="vi"?"Viết ngày tháng bằng tiếng Anh.":"Write the date in English.");
 if(q.kind==="time")return q.mode==="digits"?(language==="vi"?"Nhập giờ theo định dạng 24 giờ HH:MM.":"Enter the time in 24-hour format (HH:MM)."):(language==="vi"?"Viết giờ bằng tiếng Anh.":"Write the time in English.");
 if(q.kind==="money")return q.mode==="digits"?(language==="vi"?"Nhập số tiền bằng chữ số (VND).":"Write the amount in digits (VND)."):(language==="vi"?"Viết số tiền bằng tiếng Anh.":"Write the amount in English.");
 return "";
}
function model(q){
 if(q.kind==="number")return q.mode==="digits"?String(q.value):numWords(q.value);
 if(q.kind==="ordinal")return q.mode==="digits"?q.value+((q.value%100>=11&&q.value%100<=13)?"th":q.value%10===1?"st":q.value%10===2?"nd":q.value%10===3?"rd":"th"):ordinal(q.value);
 if(q.kind==="day"||q.kind==="month")return q.value;
 if(q.kind==="date")return q.mode==="digits"?hhmm(q.day,q.month)+"/"+q.year:months[q.month-1]+" "+ordinal(q.day);
 if(q.kind==="time")return q.mode==="digits"?hhmm(q.hour,q.minute):englishTime(q.hour,q.minute,"past");
 if(q.kind==="money")return q.mode==="digits"?fmtAmount(q.value):numWords(q.value)+" dong";
 return "";
}
function cue(q){
 if(q.kind==="number")return q.mode==="digits"?numWords(q.value):q.value.toLocaleString("en-US");
 if(q.kind==="ordinal")return q.mode==="digits"?ordinal(q.value):q.value+((q.value%10===1&&q.value!==11)?"st":(q.value%10===2&&q.value!==12)?"nd":(q.value%10===3&&q.value!==13)?"rd":"th");
 if(q.kind==="day"||q.kind==="month")return ({"Monday":"Thứ Hai","Tuesday":"Thứ Ba","Wednesday":"Thứ Tư","Thursday":"Thứ Năm","Friday":"Thứ Sáu","Saturday":"Thứ Bảy","Sunday":"Chủ Nhật","January":"Tháng Một","February":"Tháng Hai","March":"Tháng Ba","April":"Tháng Tư","May":"Tháng Năm","June":"Tháng Sáu","July":"Tháng Bảy","August":"Tháng Tám","September":"Tháng Chín","October":"Tháng Mười","November":"Tháng Mười Một","December":"Tháng Mười Hai"})[q.value];
 if(q.kind==="date")return q.mode==="digits"?months[q.month-1]+" "+ordinal(q.day)+", "+q.year:hhmm(q.day,q.month)+"/"+q.year;
 if(q.kind==="time")return q.mode==="digits"?englishTime(q.hour,q.minute,"past"):hhmm(q.hour,q.minute);
 if(q.kind==="money")return q.mode==="digits"?numWords(q.value)+" dong":fmtAmount(q.value);
 return "";
}
function audioText(q){
 if(q.kind==="date")return months[q.month-1]+" "+ordinal(q.day)+" twenty twenty-six";
 if(q.kind==="time")return englishTime(q.hour,q.minute,"past");
 if(q.kind==="money")return numWords(q.value)+" dong";
 if(q.kind==="ordinal")return ordinal(q.value);
 if(q.kind==="number")return numWords(q.value);
 return q.value;
}
function clock(h,m){const hr=(h%12)*30+m/2,min=m*6;return '<svg viewBox="0 0 160 160" class="v22-clock" role="img" aria-label="Analogue clock"><circle cx="80" cy="80" r="73" fill="#fff" stroke="#9db7df" stroke-width="3"/>'+[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>{const a=n*Math.PI/6,x=80+58*Math.sin(a),y=80-58*Math.cos(a);return '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="11" fill="#324d76">'+n+'</text>'}).join("")+'<line x1="80" y1="80" x2="'+(80+35*Math.sin(hr*Math.PI/180))+'" y2="'+(80-35*Math.cos(hr*Math.PI/180))+'" stroke="#203f70" stroke-width="5" stroke-linecap="round"/><line x1="80" y1="80" x2="'+(80+49*Math.sin(min*Math.PI/180))+'" y2="'+(80-49*Math.cos(min*Math.PI/180))+'" stroke="#688fd2" stroke-width="3" stroke-linecap="round"/><circle cx="80" cy="80" r="4" fill="#203f70"/></svg>'}
function question(){
 if(state.index>=state.deck.length)return completed();
 const q=state.deck[state.index];const value=cue(q),useClock=q.kind==="time"&&state.mode!=="listen"&&q.mode==="words";
 const shown=state.mode==="listen"?'<div class="v22-audio"><p>'+(language==="vi"?"Nghe rồi viết câu trả lời.":"Listen before answering.")+'</p><button class="btn secondary small" onclick="v22Speak(1)">▶ '+tr("normal")+'</button> <button class="btn outline small" onclick="v22Speak(.75)">▶ '+tr("slow")+'</button></div>':(useClock?clock(q.hour,q.minute):'<div class="v22-cue">'+d(value)+'</div>');
 const feedback=state.answered?'<div class="feedback '+(state.correct?"":"review")+'"><strong>'+tr(state.correct?"correct":"wrong")+'</strong><p>'+tr("reference")+': <b>'+d(model(q))+'</b></p>'+(state.correct?"":'<p>'+tr("review")+'</p>')+'</div>':"";
 show('<button class="btn outline small" onclick="v22Hub()">← '+tr("back")+'</button><h1>'+d(sessionData[state.session].title)+' · '+tr(state.mode==="assessment"?"test":state.mode==="listen"?"listen":"practice")+'</h1><p class="v22-vn">'+d(sessionData[state.session].vn)+'</p><div class="row muted"><span>'+tr("questions")+' '+(state.index+1)+' / '+state.deck.length+'</span><span>'+tr("score")+': '+state.score+'</span></div><div class="progress meter"><div style="width:'+Math.round(100*state.index/state.deck.length)+'%"></div></div><div class="card"><p class="v22-instruction">'+d(questionPrompt(q))+'</p>'+shown+'<label for="v22Answer"><b>'+tr("answer")+'</b></label><input id="v22Answer" class="short-answer" style="max-width:100%" autocomplete="off" value="'+d(state.input)+'" '+(state.answered?"disabled":"")+' oninput="v22Input(this.value)" placeholder="'+tr("prompt")+'"><div class="check-next-row"><button class="btn" onclick="v22Check()" '+(state.answered?"disabled":"")+'>'+tr("check")+'</button>'+(state.answered?'<button class="btn secondary" onclick="v22Next()">'+tr(state.index===state.deck.length-1?"finish":"next")+' →</button>':"")+'</div>'+feedback+'</div>');
}
function completed(){saveScore();const total=state.deck.length;show('<button class="btn outline small" onclick="v22Hub()">← '+tr("back")+'</button><div class="card"><h1>'+tr("result")+'</h1><div class="v22-big-score">'+state.score+' / '+total+'</div><p>'+tr("score")+'</p><div class="actions"><button class="btn" onclick="v22Begin(\''+state.mode+'\')">'+tr("again")+'</button><button class="btn secondary" onclick="v22Hub()">'+tr("back")+'</button></div></div>')}
function begin(mode){
 state.mode=mode;state.index=0;state.input="";state.answered=false;state.correct=false;state.score=0;
 let questions=[...banks[state.session]];
 if(mode==="listen")questions=questions.slice(0,10).map(q=>({...q,mode:"digits",allow12:false}));
 if(mode==="assessment")questions=state.session===4?questions.slice(0,20):questions.slice(0,10);
 state.deck=questions;
 state.stage="question";view="v22Question";question();
}
function open(si){unit=uiIndex;session=si;state.session=si;state.stage="hub";view="v22Hub";hub();window.scrollTo(0,0)}
function back(){unit=uiIndex;view="curriculum";render();window.scrollTo(0,0)}
window.v22Open=open;window.v22All=back;window.v22Hub=()=>open(state.session);window.v22Begin=begin;window.v22Input=x=>{state.input=x};window.v22Check=()=>{if(state.answered||!state.input.trim())return;const q=state.deck[state.index];state.correct=numericAnswer(q,state.input);state.score+=Number(state.correct);state.answered=true;question()};window.v22Next=()=>{if(!state.answered)return;state.index++;state.answered=false;state.input="";question()};window.v22Speak=(rate)=>{const q=state.deck[state.index];if(window.wynnlingSpeak)window.wynnlingSpeak(audioText(q),rate);else if(typeof speak==="function")speak(audioText(q),rate)};
const priorGoSession=goSession;goSession=function(ui,si){if(ui===uiIndex)return open(si);return priorGoSession(ui,si)};
const priorStart=start;start=function(ui,si,mode){if(ui===uiIndex){open(si);return begin(mode==="test"?"assessment":"practice")}return priorStart(ui,si,mode)};
const priorCurriculum=curriculum;curriculum=function(){if(unit!==uiIndex)return priorCurriculum();const p=progress();shell('<div class="eyebrow">'+tr("unit")+' · A1–A2</div><h1>'+tr("name")+'</h1><p class="v22-vn">'+tr("sub")+'</p><p>'+tr("intro")+'</p><div class="v22-unit-list">'+sessionData.map((s,i)=>'<div class="card v22-unit-row"><div class="num">'+(i+1)+'</div><div class="v22-unit-info"><h3>'+d(s.title)+'</h3><p class="v22-vn">'+d(s.vn)+'</p><small>30 '+tr("practice")+' · 10 '+tr("listen")+' · '+(i===4?20:10)+' '+tr("test")+'</small></div><span class="tag">'+(p["assessment-"+i]===undefined?"—":p["assessment-"+i]+"/"+(i===4?20:10))+'</span><button class="btn small" onclick="v22Open('+i+')">'+tr("go")+' →</button></div>').join("")+'</div><p class="note">'+tr("note")+'</p>')};
const priorRender=render;render=function(){if(view==="v22Hub")return hub();if(view==="v22Question")return question();return priorRender()};
const priorHome=home;home=function(){priorHome();const main=document.querySelector("main");if(main){const count=main.querySelector(".overview-top .tag");if(count)count.title="Unit 04 includes a separate numerical assessment"}};
window.WynnlingV22={numWords,ordinal,englishTime,numericAnswer,banks,sessionData,uiIndex};
})();