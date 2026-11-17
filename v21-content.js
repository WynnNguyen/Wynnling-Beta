/* Wynnling v21 | Content alignment, bilingual grammar, topic labeling. */
(function(){
"use strict";
const extraContinuous=[
[
["Chị gái tôi đang đọc sách trong phòng.","My older sister is reading a book in her room."],
["Mẹ tôi đang nấu bữa tối trong bếp.","My mother is cooking dinner in the kitchen."],
["Chúng tôi đang nghe nhạc ở nhà.","We are listening to music at home."],
["Bạn đang viết bài tập về nhà à?","Are you writing your homework?"],
["Bố tôi không xem TV lúc này.","My father is not watching TV at the moment."]
],
[
["Em trai tôi đang chơi bóng đá trên sân.","My younger brother is playing football on the field."],
["Chúng tôi đang tập luyện ở phòng tập.","We are training at the gym."],
["Anh ấy không bơi ở hồ bơi hôm nay.","He is not swimming in the pool today."],
["Đội bóng đang nghỉ ngơi sau trận đấu.","The team is resting after the match."],
["Bạn có đang chạy trên sân không?","Are you running on the field?"]
],
[
["Mẹ tôi đang rửa bát trong bếp.","My mother is washing the dishes in the kitchen."],
["Chúng tôi đang dọn phòng bây giờ.","We are cleaning the room now."],
["Bố tôi không nấu bữa trưa hôm nay.","My father is not cooking lunch today."],
["Em gái tôi đang quét sàn nhà.","My younger sister is sweeping the floor."],
["Bạn có đang giặt quần áo không?","Are you doing the laundry?"]
],
[
["Tôi đang chuẩn bị bài thuyết trình.","I am preparing a presentation."],
["Đồng nghiệp của tôi đang đánh máy trong văn phòng.","My colleague is typing in the office."],
["Chúng tôi đang thảo luận về cuộc họp.","We are discussing the meeting."],
["Anh ấy không làm bài tập về nhà lúc này.","He is not doing his homework at the moment."],
["Giáo viên đang viết gì?","What is the teacher writing?"]
],
[
["Tôi đang đi bộ đến siêu thị.","I am walking to the supermarket."],
["Chị gái tôi đang mua đồ ăn tại cửa hàng.","My older sister is buying food at the shop."],
["Họ không lái xe lúc này.","They are not driving at the moment."],
["Anh ấy đang chờ xe buýt ở trạm.","He is waiting for the bus at the bus stop."],
["Bạn đang gọi món gì ở nhà hàng?","What are you ordering at the restaurant?"]
]
];
const extraFuture=[
[
["Tôi sẽ học tiếng Anh vào ngày mai.","I will study English tomorrow."],
["Chị gái tôi sẽ chuẩn bị bữa sáng ngày mai.","My older sister will prepare breakfast tomorrow."],
["Chúng tôi sẽ bắt đầu dự án mới vào tuần sau.","We will start a new project next week."],
["Bố tôi sẽ thăm ông bà vào ngày mai.","My father will visit my grandparents tomorrow."],
["Bạn sẽ ở nhà tối nay chứ?","Will you be at home this evening?"]
],
[
["Tôi sẽ không đi muộn vào ngày mai.","I will not be late tomorrow."],
["Em trai tôi sẽ không quên bài tập về nhà.","My younger brother will not forget his homework."],
["Chúng tôi sẽ không rời đi sớm.","We will not leave early."],
["Cô ấy sẽ không mắc lỗi đó lần nữa.","She will not make that mistake again."],
["Anh ấy sẽ không bỏ cuộc.","He will not give up."]
],
[
["Bạn sẽ tham gia cuộc họp chứ?","Will you join the meeting?"],
["Chị gái tôi sẽ mua vé vào ngày mai.","My older sister will buy a ticket tomorrow."],
["Họ sẽ đến bữa tiệc vào cuối tuần này chứ?","Will they come to the party this weekend?"],
["Em trai bạn sẽ mang theo quyển sách chứ?","Will your younger brother bring the book?"],
["Chúng ta sẽ gặp nhau sau giờ học chứ?","Will we meet after class?"]
],
[
["Khi nào chị gái bạn sẽ đến nơi?","When will your older sister arrive?"],
["Họ sẽ đi du lịch ở đâu vào tháng sau?","Where will they travel next month?"],
["Tại sao bạn sẽ rời đi sớm?","Why will you leave early?"],
["Bạn sẽ ở lại bao lâu?","How long will you stay?"],
["Chúng ta sẽ gặp nhau như thế nào?","How will we meet?"]
],
[
["Tôi nghĩ ngày mai trời sẽ đẹp.","I think the weather will be nice tomorrow."],
["Em trai tôi sẽ vượt qua kỳ thi.","My younger brother will pass the exam."],
["Tôi hy vọng tiếng Anh của mình sẽ tốt hơn.","I hope my English will be better."],
["Bạn sẽ làm gì trong tương lai?","What will you do in the future?"],
["Chúng tôi sẽ không từ bỏ hy vọng.","We will not give up hope."]
]
];
for(const [ui,extras] of [[1,extraContinuous],[2,extraFuture]]){
 const sessions=units[ui]?.sessions||[];
 if(sessions.length!==5)console.warn("v21: unexpected session count",ui,sessions.length);
 sessions.forEach((s,i)=>{if(extras[i]&&Array.isArray(s.v3vn)&&s.v3vn.length===5)s.v3vn.push(...extras[i])});
}
const aux={listen:"nghe",go:"đi",have:"có / ăn",make:"làm",do:"làm",wake:"thức dậy",get:"lấy / trở nên",take:"lấy",care:"quan tâm",spend:"dành",brush:"chải",shop:"mua sắm",watch:"xem",play:"chơi"};
const nouns={music:"âm nhạc",shopping:"việc mua sắm",breakfast:"bữa sáng",lunch:"bữa trưa",dinner:"bữa tối",homework:"bài tập về nhà"};
for(const unit of units){for(const s of unit.sessions){
 const existing=new Set(s.words.map(w=>w[0].toLowerCase()));
 for(const w of s.words){
  if(w[2]!=="v"||!(/\s|\//.test(w[0])))continue;
  w[2]="phr"; // a multiword verb expression is a phrase, not an isolated verb.
  const head=w[0].split(/[\s/]/)[0].toLowerCase();
  if(aux[head]&&!existing.has(head)){s.words.push([head,aux[head],"v"]);existing.add(head)}
  for(const [n,tr] of Object.entries(nouns)){if(new RegExp("\\b"+n+"\\b","i").test(w[0])&&!existing.has(n)){s.words.push([n,tr,"n"]);existing.add(n)}}
 }
 // Keep single lexical verbs as verbs and all multiword units as phrases.
 const seen=new Set();s.words=s.words.filter(w=>{const key=w[0].toLowerCase()+"|"+w[2];if(seen.has(key))return false;seen.add(key);return true});
}}
const labels={present:"Thì hiện tại đơn",continuous:"Thì hiện tại tiếp diễn",future:"Thì tương lai đơn"};
window.WynnlingV21=Object.assign(window.WynnlingV21||{},{tenseLabels:labels,extraQuestions:50});
function subtitleFor(id){return '<small class="v21-tense-subtitle" style="display:block;font:500 12px/1.6 sans-serif;color:#6c83a3;margin-top:4px">'+labels[id]+'</small>'}
function applyTenseSubtitle(id,selector){const e=document.querySelector(selector);if(e&&!e.querySelector(".v21-tense-subtitle")&&labels[id])e.insertAdjacentHTML("beforeend",subtitleFor(id))}
const prevGuide=guide;
guide=function(){prevGuide();
 applyTenseSubtitle(drillTense,"main .overview-section h2");
 const questions={
 present:[["What","What do you study?","Bạn học gì?"],["Where","Where does she work?","Cô ấy làm việc ở đâu?"],["When","When do they have lunch?","Họ ăn trưa khi nào?"],["Who","Who do you visit on Sundays?","Bạn thăm ai vào Chủ nhật?"],["Why","Why does he exercise?","Tại sao anh ấy tập thể dục?"],["How","How does she go to school?","Cô ấy đi học bằng cách nào?"],["How often","How often do you read?","Bạn đọc sách bao lâu một lần?"],["How many","How many books do you have?","Bạn có bao nhiêu quyển sách?"],["How much","How much does this book cost?","Quyển sách này giá bao nhiêu?"]],
 continuous:[["What","What are you reading?","Bạn đang đọc gì?"],["Where","Where is she going?","Cô ấy đang đi đâu?"],["When","When are they leaving?","Họ sẽ rời đi khi nào?"],["Who","Who are you talking to?","Bạn đang nói chuyện với ai?"],["Why","Why is he crying?","Tại sao anh ấy đang khóc?"],["How","How are you getting home?","Bạn đang về nhà bằng cách nào?"],["How often","How often are you training this week?","Tuần này bạn đang tập luyện thường xuyên đến mức nào?"],["How many","How many people are waiting?","Có bao nhiêu người đang chờ?"],["How much","How much are you spending?","Bạn đang chi bao nhiêu tiền?"]],
 future:[["What","What will you do tomorrow?","Ngày mai bạn sẽ làm gì?"],["Where","Where will they travel?","Họ sẽ đi du lịch ở đâu?"],["When","When will she arrive?","Cô ấy sẽ đến khi nào?"],["Who","Who will you meet?","Bạn sẽ gặp ai?"],["Why","Why will he leave early?","Tại sao anh ấy sẽ rời đi sớm?"],["How","How will you get there?","Bạn sẽ đến đó bằng cách nào?"],["How often","How often will you exercise next week?","Tuần sau bạn sẽ tập thể dục bao lâu một lần?"],["How many","How many tickets will you buy?","Bạn sẽ mua bao nhiêu vé?"],["How much","How much will you pay?","Bạn sẽ trả bao nhiêu tiền?"]]
 }[drillTense]||[];
 const pane=document.querySelector(".question-types");
 if(pane)pane.innerHTML=questions.map(([word,example,meaning])=>'<div class="question-type"><b>'+word+'</b><small>'+example+' <span style="color:#5377a1">('+meaning+')</span></small></div>').join("");
 // One action per formula if no linked session exists.
 document.querySelectorAll(".formula-card").forEach((card,i)=>{
  const type=tenseGuides[drillTense].types[i]?.[0];
  const found=units.find(u=>u.id===drillTense)?.sessions.some((s,j)=>sessionFocus[drillTense][j]?.includes(type));
  if(!found){const actions=card.querySelector(".formula-actions");if(actions){const buttons=[...actions.querySelectorAll("button")];buttons.slice(1).forEach(b=>b.remove());}const other=card.querySelector(".topic-chips");other?.remove();}
 });
};
const prevTopics=grammarTopics;
grammarTopics=function(){prevTopics();document.querySelectorAll(".tense-topic").forEach((card,i)=>{const id=units[i]?.id;const h=card.querySelector("h3");if(h&&labels[id]&&!h.querySelector(".v21-tense-subtitle"))h.insertAdjacentHTML("beforeend",subtitleFor(id))})};
const prevCurriculum=curriculum;
curriculum=function(){prevCurriculum();applyTenseSubtitle(units[unit].id,"main h1")};
const betterRules={
 continuous:{
 affirmative:"I → am + V-ing\\nHe/She/It; danh từ số ít → is + V-ing\\nYou/We/They; danh từ số nhiều → are + V-ing",
 negative:"I → am not + V-ing\\nHe/She/It → is not + V-ing\\nYou/We/They → are not + V-ing",
 yesno:"Am + I + V-ing?\\nIs + he/she/it + V-ing?\\nAre + you/we/they + V-ing?",
 wh:"WH + am/is/are + S + V-ing?"
 },
 future:{
 affirmative:"Mọi chủ ngữ → will + V₀",
 negative:"Mọi chủ ngữ → will not (won't) + V₀",
 yesno:"Will + S + V₀?",
 wh:"WH + will + S + V₀?",
 be:"Mọi chủ ngữ → will be + danh từ/tính từ"
 }
};
for(const [tense,types] of Object.entries(betterRules))for(const [type,vi] of Object.entries(types))if(compactRules[tense]?.[type])compactRules[tense][type].vi=vi.replace(/\\n/g,"\n");
// Keep single-word verbs separate from multiword expressions across non-Present-Simple units.
for(const u of units.filter(item=>item.id==="continuous"||item.id==="future")){
 for(const lesson of u.sessions){
  for(const word of lesson.words||[]){
   if(word[2]==="v"&&/\s/.test(word[0]))word[2]="phr";
   if(word[2]==="phr"&&/^(before|after|near)$/i.test(word[0]))word[2]="prep";
  }
 }
}
const oldTopicSticker=topicSticker;
topicSticker=function(name){
 const v=String(name).toLowerCase();
 if(/sinh hoạt|daily routine/.test(v))return"🌅";
 if(/gia đình|family/.test(v))return"👨‍👩‍👧";
 if(/trường học|school|education/.test(v))return"🎓";
 if(/công việc|nghề nghiệp|work|occupation/.test(v))return"💼";
 if(/sở thích|hobbies|free time/.test(v))return"🎸";
 if(/tính cách|cảm xúc|personality|feelings/.test(v))return"🧠";
 return oldTopicSticker(name);
};
})();