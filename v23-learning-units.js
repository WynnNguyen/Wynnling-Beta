/* Wynnling v23 — clear Learning Units navigation and explicit Unit 04 instruction cards */
(function(){
"use strict";
const E=()=>language==="vi";
const esc=(s)=>escapeHtml(String(s));
const names=[
 ["Present Simple","Thì hiện tại đơn","🌅","6 sessions · Vocabulary · Grammar · Translation","6 buổi · Từ vựng · Ngữ pháp · Dịch câu"],
 ["Present Continuous","Thì hiện tại tiếp diễn","🏃","5 sessions · Vocabulary · Grammar · Translation","5 buổi · Từ vựng · Ngữ pháp · Dịch câu"],
 ["Future Simple","Thì tương lai đơn","📅","5 sessions · Vocabulary · Grammar · Translation","5 buổi · Từ vựng · Ngữ pháp · Dịch câu"],
 ["Numbers, Dates & Time","Số đếm, ngày tháng và giờ giấc","🔢","5 sessions · Learn · Match · Practise · Listen","5 buổi · Học · Nối cặp · Luyện tập · Nghe"]
];
function unitDirectory(){
 shell('<section class="v23-directory"><div class="eyebrow">'+(E()?"LỘ TRÌNH HỌC · A1–A2":"LEARNING PATH · A1–A2")+'</div><h1>'+(E()?"Các bài học":"Learning Units")+'</h1><p class="v23-intro">'+(E()?"Chọn một bài học để xem các buổi học và bắt đầu luyện tập.":"Choose a unit to explore its sessions, learn the rules, and practise.")+'</p><div class="v23-unit-grid">'+names.map((u,i)=>'<button type="button" class="v23-unit-card" onclick="v23OpenUnit('+i+')"><div class="v23-unit-top"><span class="v23-unit-icon">'+u[2]+'</span><span class="v23-unit-badge">'+(E()?"BÀI":"UNIT")+' '+String(i+1).padStart(2,"0")+'</span></div><h2>'+esc(u[0])+'</h2><p class="v23-unit-vn">'+esc(u[1])+'</p><div class="v23-unit-foot"><span>'+esc(E()?u[4]:u[3])+'</span><span class="v23-unit-arrow">→</span></div></button>').join("")+'</div></section>');
}
function returnButton(){
 return '<button class="btn outline v23-back" type="button" onclick="v23AllUnits()">← '+(E()?"Quay lại các bài học":"Back to Units")+'</button>';
}
function showUnitDetail(){
 // Keeps each tense unit's existing content; no duplicate navigation dropdown.
 curriculum();
 const main=document.querySelector("main");if(!main)return;
 const first=main.firstElementChild;
 if(first && !main.querySelector(".v23-back"))first.insertAdjacentHTML("beforebegin",returnButton());
 const picker=main.querySelector('select[aria-label="Select unit"]');
 if(picker)picker.style.display="none";
}
window.v23OpenUnit=function(i){
 if(!Number.isInteger(i)||i<0||i>=units.length)return;
 unit=i;view="unitDetail";showUnitDetail();window.scrollTo(0,0);
};
window.v23AllUnits=function(){view="curriculum";unitDirectory();window.scrollTo(0,0)};
const oldRender=render;
render=function(){
 if(view==="curriculum")return unitDirectory();
 if(view==="unitDetail")return showUnitDetail();
 return oldRender();
};
const oldCurriculum=curriculum;
curriculum=function(){
 if(view==="unitDetail"){
  oldCurriculum();
  const main=document.querySelector("main");
  if(main&&!main.querySelector(".v23-back"))main.insertAdjacentHTML("afterbegin",returnButton());
  const picker=main?.querySelector('select[aria-label="Select unit"]');
  if(picker)picker.style.display="none";
  return;
 }
 return oldCurriculum();
};
const oldNavigate=navigate;
navigate=function(v){if(v==="curriculum"){view=v;unitDirectory();window.scrollTo(0,0);return}return oldNavigate(v)};
const guides=[
 {title:["How to read numbers","Cách đọc số"],rules:[
 ["0–19: learn the basic forms","0–19: học các từ số cơ bản"],
 ["20–99: tens + ones (21 = twenty-one)","20–99: hàng chục + hàng đơn vị (21 = twenty-one)"],
 ["100–999: hundred + and + remainder (105 = one hundred and five)","100–999: hundred + and + số còn lại (105 = one hundred and five)"],
 ["1,000+: thousand / million (1,250 = one thousand two hundred and fifty)","1.000 trở lên: thousand / million (1,250 = one thousand two hundred and fifty)"],
 ["Ordinal numbers: 1st = first; 2nd = second; 3rd = third; 4th = fourth","Số thứ tự: 1st = first; 2nd = second; 3rd = third; 4th = fourth"]
 ],instruction:["Write exactly what the question asks: digits, English number words, or ordinal words.","Viết đúng định dạng được yêu cầu: chữ số, số bằng tiếng Anh hoặc số thứ tự."]},
 {title:["Days, months & writing dates","Thứ, tháng và cách viết ngày"],rules:[
 ["Days: Monday → Sunday; months: January → December","Thứ: Monday → Sunday; tháng: January → December"],
 ["Dates use ordinal numbers when spoken (17 → seventeenth)","Ngày được đọc bằng số thứ tự (17 → seventeenth)"],
 ["British: 17 November 2026 → the seventeenth of November, twenty twenty-six","Anh-Anh: 17 November 2026 → the seventeenth of November, twenty twenty-six"],
 ["American: November 17, 2026 → November seventeenth, twenty twenty-six","Anh-Mỹ: November 17, 2026 → November seventeenth, twenty twenty-six"],
 ["Use on for days/dates; in for months/years (on Monday, in November).","Dùng on với thứ/ngày; in với tháng/năm (on Monday, in November)."]
 ],instruction:["Numeric dates here use DD/MM/YYYY: day / month / year. For weekday and month names, translate from Vietnamese into English.","Ngày dạng số dùng DD/MM/YYYY: ngày / tháng / năm. Với thứ và tháng, hãy dịch từ tiếng Việt sang tiếng Anh."]},
 {title:["Telling time: digital & conversational","Cách đọc giờ: kiểu số và kiểu past/to"],rules:[
 ["DIGITAL: hour + minutes → 7:20 = seven twenty; 8:45 = eight forty-five.","KIỂU SỐ: giờ + phút → 7:20 = seven twenty; 8:45 = eight forty-five."],
 ["When the minute is 01–09, say oh: 7:05 = seven oh five.","Khi phút từ 01–09, đọc oh: 7:05 = seven oh five."],
 ["Exact hour: 7:00 = seven o'clock. Half-hour: 7:30 = seven thirty / half past seven.","Giờ chẵn: 7:00 = seven o'clock. Giờ rưỡi: 7:30 = seven thirty / half past seven."],
 ["PAST: minute + past + hour → 7:20 = twenty past seven; 7:15 = (a) quarter past seven.","PAST: phút + past + giờ → 7:20 = twenty past seven; 7:15 = (a) quarter past seven."],
 ["TO: remaining minutes + to + next hour → 7:45 = (a) quarter to eight; 7:50 = ten to eight.","TO: số phút còn lại + to + giờ kế → 7:45 = (a) quarter to eight; 7:50 = ten to eight."],
 ["a.m. is before noon; p.m. is after noon. 12 a.m. = midnight, 12 p.m. = noon.","a.m. là trước trưa; p.m. là sau trưa. 12 a.m. = nửa đêm, 12 p.m. = trưa."]
 ],instruction:["Both seven twenty and twenty past seven are correct for 7:20. In numerical questions, enter HH:MM in 24-hour time; 7.20 is also understood.","7:20 có thể đọc seven twenty hoặc twenty past seven. Khi nhập giờ dạng số, dùng HH:MM (24 giờ); 7.20 cũng được chấp nhận."]},
 {title:["Money: understand the place values","Tiền tệ: hiểu các hàng số"],rules:[
 ["100 = one hundred (một trăm).","100 = one hundred (một trăm)."],
 ["1,000 = one thousand (một nghìn).","1.000 = one thousand (một nghìn)."],
 ["10,000 = ten thousand (mười nghìn).","10.000 = ten thousand (mười nghìn)."],
 ["100,000 = one hundred thousand (một trăm nghìn).","100.000 = one hundred thousand (một trăm nghìn)."],
 ["1,000,000 = one million (một triệu).","1.000.000 = one million (một triệu)."],
 ["10,000,000 = ten million; 100,000,000 = one hundred million.","10.000.000 = ten million; 100.000.000 = one hundred million."],
 ["1,000,000,000 = one billion (một tỷ).","1.000.000.000 = one billion (một tỷ)."],
 ["Read groups of three from left to right: 325,000 = three hundred and twenty-five thousand.","Đọc các nhóm ba chữ số từ trái sang phải: 325.000 = three hundred and twenty-five thousand."],
 ["Add dong to the complete price: 25,500 ₫ = twenty-five thousand five hundred dong.","Thêm dong ở cuối số tiền: 25.500 ₫ = twenty-five thousand five hundred dong."],
 ["How much is it? → It costs ... dong.","How much is it? → It costs ... dong."]
 ],instruction:["First identify million, thousand and hundred groups; then read the amount and add dong. Enter digits without punctuation or with thousand separators.","Nhận diện các hàng triệu, nghìn, trăm trước, sau đó đọc số và thêm dong. Có thể nhập chữ số liền nhau hoặc có dấu phân cách hàng nghìn."]},
 {title:["Real-life number skills","Ứng dụng trong giao tiếp"],rules:[
 ["Appointments: day + date + time (Thursday, November 19, at 3:30 p.m.)","Cuộc hẹn: thứ + ngày + giờ (Thursday, November 19, at 3:30 p.m.)"],
 ["Class timetables: on Monday at eight forty-five","Lịch học: on Monday at eight forty-five"],
 ["Birthdays: My birthday is on June twenty-first.","Sinh nhật: My birthday is on June twenty-first."],
 ["Shopping: This costs three hundred and twenty-five thousand dong.","Mua sắm: This costs three hundred and twenty-five thousand dong."],
 ["Pay attention to the exact requested format, especially dates and 24-hour times.","Chú ý định dạng được yêu cầu, đặc biệt với ngày tháng và giờ 24 giờ."]
 ],instruction:["Review the four previous lessons before attempting mixed practice and the final assessment.","Ôn bốn bài trước khi làm bài tập tổng hợp và bài đánh giá cuối."]}
];
function instructions(i){
 const d=guides[i];if(!d)return"";
 const loc=E()?1:0;
 return '<div class="v23-instructions"><div class="v23-instruction-heading"><span class="v23-instruction-mark">📘</span><div><small>'+(E()?"HƯỚNG DẪN HỌC":"HOW IT WORKS")+'</small><h2>'+esc(d.title[loc])+'</h2></div></div><div class="v23-rule-list">'+d.rules.map((row,n)=>'<div class="v23-rule"><span class="v23-rule-n">'+String(n+1).padStart(2,"0")+'</span><span>'+esc(row[loc])+'</span></div>').join("")+'</div><div class="v23-task-tip"><strong>'+(E()?"Cách làm bài: ":"Practice instructions: ")+'</strong>'+esc(d.instruction[loc])+'</div></div>';
}
function refineHub(){
 if(view!=="v22Hub")return;
 const main=document.querySelector("main");if(!main)return;
 const learn=main.querySelector(".v22-samples");if(!learn)return;
 if(!main.querySelector(".v23-instructions"))learn.insertAdjacentHTML("beforebegin",instructions(session));
 const btn=main.querySelector('button[onclick="v22All()"]');
 if(btn){btn.textContent=E()?"← Về bài 04":"← Back to Unit 04";btn.setAttribute("onclick","v23OpenUnit(3)");}
 const details=main.querySelector(".v22-guide");if(details)details.open=false;
}
const oldV22Open=window.v22Open,oldV22Hub=window.v22Hub;
window.v22Open=function(i){oldV22Open(i);refineHub()};
window.v22Hub=function(){oldV22Hub();refineHub()};
const beforeGo=goSession;
goSession=function(ui,si){beforeGo(ui,si);refineHub()};
const prior23Render=render;
render=function(){prior23Render();refineHub()};
window.WynnlingV23={guides,unitDirectory,instructions};
})();