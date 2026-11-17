/* Wynnling v24 — grammar-only reference, extensible topic stickers, stable sticky navigation. */
(function(){
"use strict";
const GRAMMAR_IDS=["present","continuous","future"];
const locale=()=>language==="vi";
const safe=s=>escapeHtml(String(s));
const grammarOnly=()=>units.filter(u=>GRAMMAR_IDS.includes(u.id));
const stickerRules=[
[/daily|routine|sinh hoạt|thói quen/i,"🌅"],
[/family|relationship|gia đình|quan hệ/i,"👨‍👩‍👧"],
[/school|education|trường học|giáo dục/i,"🎓"],
[/occupation|work|job|công việc|nghề nghiệp/i,"💼"],
[/hobb|free time|sở thích|thời gian rảnh/i,"🎨"],
[/personality|feelings|preferences|tính cách|cảm xúc/i,"💜"],
[/sport|movement|thể thao|vận động/i,"🏀"],
[/home|chores|nhà cửa|việc nhà/i,"🧹"],
[/around town|city|thành phố|quanh phố/i,"🏙️"],
[/happening|right now|bây giờ|đang xảy ra/i,"⏱️"],
[/plan|tomorrow|kế hoạch|ngày mai/i,"🗓️"],
[/promise|help|lời hứa|giúp đỡ/i,"🤝"],
[/invitation|decision|lời mời|quyết định/i,"🎉"],
[/information|thông tin/i,"🔎"],
[/prediction|hope|dự đoán|hy vọng/i,"🔭"],
[/number|ordinal|số đếm|số thứ tự/i,"🔢"],
[/date|day|month|ngày tháng|thứ|tháng/i,"📅"],
[/telling time|clock|hour|giờ giấc|đồng hồ|cách đọc giờ/i,"🕒"],
[/money|price|shopping|tiền|giá cả/i,"💵"],
[/mixed|tổng hợp/i,"🧩"]
];
function sticker(name,fallback="📚"){
 const raw=String(name||"");
 for(const [re,icon] of stickerRules)if(re.test(raw))return icon;
 return fallback;
}
function unitIcon(u){
 if(u.id==="present")return "🌅";
 if(u.id==="continuous")return "🏃";
 if(u.id==="future")return "🗓️";
 if(u.id==="everyday")return "🔢";
 return sticker(u.name,"📚");
}
window.WynnlingStickers={unit:unitIcon,topic:sticker,register:(pattern,emoji)=>{if(pattern instanceof RegExp&&typeof emoji==="string"&&emoji)stickerRules.unshift([pattern,emoji])}};
topicSticker=function(name){return sticker(name)};
function updateStickers(){
 const subjects=units.flatMap(u=>u.sessions.map(s=>s));
 document.querySelectorAll(".topic-card").forEach((card,i)=>{
  const title=subjects[i]?.name||card.querySelector("b")?.textContent||"";
  const icon=sticker(title,unitIcon(units.find(u=>u.sessions.includes(subjects[i]))||{}));
  const existing=card.querySelector(".vocab-sticker,.v24-topic-icon");
  if(existing){existing.textContent=icon;existing.classList.add("v24-topic-icon")}
  else {const badge=document.createElement("span");badge.className="v24-topic-icon";badge.textContent=icon;badge.setAttribute("aria-hidden","true");card.prepend(badge)}
 });
 document.querySelectorAll(".v23-unit-card").forEach((card,i)=>{
  const icon=card.querySelector(".v23-unit-icon");
  if(icon&&units[i])icon.textContent=unitIcon(units[i]);
 });
}
const oldTopics=vocabularyTopics;
vocabularyTopics=function(){oldTopics();updateStickers()};
const oldVocabulary=vocabulary;
vocabulary=function(){oldVocabulary();const s=units[unit]?.sessions[session];if(!s)return;const icon=document.querySelector("main h1 .vocab-sticker");if(icon)icon.textContent=sticker(s.name,unitIcon(units[unit]))};
const prevGrammar=grammarTopics;
grammarTopics=function(){
 // Dedicated formula library. Do not include non-tense learning units.
 const available=grammarOnly();
 shell('<section class="v24-grammar"><div class="eyebrow">'+(locale()?"THƯ VIỆN NGỮ PHÁP · A1–A2":"GRAMMAR REFERENCE · A1–A2")+'</div><h1>'+(locale()?"Công thức ngữ pháp":"Grammar Formulas")+'</h1><p>'+(locale()?"Chọn một thì để xem lại công thức, quy tắc sử dụng và luyện 5 câu cho từng dạng. Số đếm, ngày tháng và giờ nằm trong Learning Units.":"Choose a tense to review its formulas, usage rules, and practise five questions per structure. Numbers, dates, and time belong in Learning Units.")+'</p><div class="tense-topic-grid">'+available.map(u=>{
 const count=tenseGuides[u.id]?.types?.length||0;
 const label=u.id==="present"?"Thì hiện tại đơn":u.id==="continuous"?"Thì hiện tại tiếp diễn":"Thì tương lai đơn";
 return '<article class="tense-topic v24-tense"><span class="tag">A1–A2</span><h3>'+safe(u.name)+'</h3><small class="v24-tense-sub">'+label+'</small><p>'+count+' '+(locale()?"dạng công thức · 5 câu luyện tập mỗi dạng":"formula patterns · five practice questions each")+'</p><button class="btn" onclick="setTense(\''+u.id+'\')">'+(locale()?"Xem công thức & luyện tập":"Review formulas & practise")+' →</button></article>';
 }).join("")+'</div></section>');
};
const oldReview=review;
review=function(){
 oldReview();
 const cards=[...document.querySelectorAll(".mastery-card")];
 cards.forEach(c=>{
  const heading=c.querySelector("h3")?.textContent||"";
  if(/numbers, dates|số đếm|everyday/i.test(heading))c.remove();
 });
};
function updateNavState(){
 const nav=document.querySelector(".topnav");
 if(!nav)return;
 const activeGrammar=["grammarTopics","guide","drill"].includes(view);
 nav.querySelectorAll(".nav").forEach(n=>{
  if(/grammarTopics|guide/.test(n.getAttribute("onclick")||""))n.classList.toggle("active",activeGrammar);
 });
}
// Keep the nav at top when the heading scrolls away; don't trap the content in an inner scroll.
const oldShell=shell;
shell=function(html){oldShell(html);updateStickers();updateNavState()};
window.WynnlingV24={grammarOnly,updateStickers,unitIcon};
})();