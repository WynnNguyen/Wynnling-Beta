/* Lesson-scoped lexical hints. Matching inflections never supplies a sentence structure. */
(function(){
'use strict';
const clean=s=>String(s||'').normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/[^\p{L}\p{N}'\s-]/gu,' ').replace(/\s+/g,' ').trim();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const blocked=new Set(['i','you','he','she','it','we','they','am','is','are','be','do','does','will','not','where','when','why','how','what','who','how long','how far','i think','i hope','anyone','each other','before','after','with us']);
const irregular={do:['does','doing','did','done'],have:['has','having','had','eat','eats','eating'],go:['goes','going','went','gone'],be:['am','is','are','being','been'],make:['makes','making','made'],get:['gets','getting','got'],run:['runs','running','ran'],swim:['swims','swimming','swam'],write:['writes','writing','wrote','written'],wake:['wakes','waking','woke','woken'],leave:['leaves','leaving','left'],buy:['buys','buying','bought'],think:['thinks','thinking','thought'],feel:['feels','feeling','felt'],spend:['spends','spending','spent'],forget:['forgets','forgetting','forgot','forgotten']};
function forms(w,pos){
 const out=new Set([w]);if(!/^[a-z]+$/.test(w))return [...out];
 if(pos==='v'||pos==='phr'){
  for(const x of irregular[w]||[])out.add(x);
  out.add(w+'s');out.add(w+'ed');out.add(w+'ing');
  if(/[^aeiou]y$/.test(w)){out.add(w.slice(0,-1)+'ies');out.add(w.slice(0,-1)+'ied')}
  if(/(?:s|sh|ch|x|o)$/.test(w))out.add(w+'es');
  if(/e$/.test(w)){out.add(w.slice(0,-1)+'ing');out.add(w+'d')}
  if(/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(w))out.add(w+w.slice(-1)+'ing');
 }else if(pos==='n'){out.add(w+'s');out.add(w+'es');if(/[^aeiou]y$/.test(w))out.add(w.slice(0,-1)+'ies')}
 return [...out];
}
function variants(english){
 const parts=english.split(/\s*\/\s*/);
 if(parts.length===1)return parts;
 // have breakfast/lunch/dinner is one taught entry, with three natural realizations.
 const lead=parts[0].includes(' ')?parts[0].slice(0,parts[0].lastIndexOf(' ')+1):'';
 return parts.map((p,i)=>i===0||p.includes(' ')?p:lead+p);
}
function candidates(item,words){
 if(!item||!Array.isArray(words))return [];
 const english=clean(item.dir==='en'||item.dir==='en-vi'?item.prompt:item.model);
 const output=[];
 for(const [bankIndex,w] of words.entries()){
  if(!Array.isArray(w)||typeof w[0]!=='string'||typeof w[1]!=='string'||blocked.has(clean(w[0])))continue;
  for(const expression of variants(w[0])){
   const term=clean(expression);if(blocked.has(term)||term.split(' ').length>5)continue;
   const tokens=term.split(' ');const pattern=tokens.map((token,i)=>{
    if(token==="one's")return '(?:my|your|his|her|our|their|one\'s)';
    const formsOfToken=forms(token,i===0?w[2]:'n');
    return '(?:'+formsOfToken.map(escape).join('|')+')';
   }).join('(?:\\s+(?:my|your|his|her|our|their))?\\s+');
   const match=new RegExp('\\b'+pattern+'\\b','i').exec(english);
   if(!match)continue;
   // Personal subjects are supplied by the prompt; do not turn them into hints.
   if(match.index<12&&/^(?:my |your |our |the )?(?:parents?|sister|brother|father|mother|family|team|teacher|colleague)/.test(english)&&/^(?:parents?|sister|brother|father|mother|family|team|teacher|colleague)$/.test(term))continue;
   output.push({english:expression,vietnamese:/^have (?:breakfast|lunch|dinner)$/.test(expression)?({'have breakfast':'ăn sáng','have lunch':'ăn trưa','have dinner':'ăn tối'}[expression]):w[1],pos:w[2],bankIndex,start:match.index,end:match.index+match[0].length});break;
  }
 }
 // Prefer the taught phrase over overlapping fragments (listen / listen to music).
 return output.filter((a,i,all)=>!all.some((b,j)=>i!==j&&b.start<=a.start&&b.end>=a.end&&(b.end-b.start>a.end-a.start||j<i&&b.end-b.start===a.end-a.start)));
}
const cache=new WeakMap();
function hints(item,words){
 if(!Array.isArray(words)||!item||typeof item.model!=='string')return [];
 const signature=words.map(w=>Array.isArray(w)?w.join('|'):'').join('~');
 let bank=cache.get(words);if(!bank||bank.signature!==signature){bank={signature,results:new Map()};cache.set(words,bank)}
 const key=JSON.stringify([item.dir,item.prompt,item.model]);
 if(bank.results.has(key))return bank.results.get(key).map(x=>({...x}));
 const result=makeHints(item,words);if(bank.results.size>=256)bank.results.delete(bank.results.keys().next().value);bank.results.set(key,result);return result.map(x=>({...x}));
}
function makeHints(item,words){
 const english=clean(item.dir==='en'||item.dir==='en-vi'?item.prompt:item.model),count=english.split(' ').length;
 const limit=count>=12?4:count>=7?3:2;
 const all=candidates(item,words),chosen=[];
 // Recall the main action first, then concrete vocabulary and meaningful time phrases.
 const rank=x=>x.pos==='v'?0:x.pos==='phr'?1:x.pos==='n'?2:x.pos==='adj'?3:4;
 for(const c of [...all].sort((a,b)=>rank(a)-rank(b)||a.start-b.start)){
  if(chosen.length===limit)break;
  chosen.push(c);
 }
 return chosen.sort((a,b)=>a.start-b.start).map(({english,vietnamese,pos,bankIndex})=>({english,vietnamese,pos,bankIndex}));
}
// Append only words already used by the lesson's existing sentences. Original indices stay stable.
const supplements={
 present:[[['in the morning','vào buổi sáng','phr']],[['after dinner','sau bữa tối','phr']],[],[['on Sundays','vào Chủ nhật','phr'],['in the morning','vào buổi sáng','phr'],['friendly','thân thiện','adj'],['have lunch','ăn trưa','phr'],['together','cùng nhau','adv'],['usually','thường','adv']], [['in the evening','vào buổi tối','phr'],['often','thường xuyên','adv']], [['examination','kỳ thi','n']]],
 continuous:[[['do homework','làm bài tập về nhà','phr'],['watch TV','xem TV','phr'],['study','học','v'],['use','sử dụng','v'],['kitchen','nhà bếp','n'],['room','phòng','n'],['at home','ở nhà','phr']], [['today','hôm nay','adv']], [['lunch','bữa trưa','n'],['today','hôm nay','adv']], [['do homework','làm bài tập về nhà','phr'],['study','học','v'],['talk to','nói chuyện với','phr'],['at the moment','lúc này','phr']], []],
 future:[[['study','học','v'],['English','tiếng Anh','n'],['tonight','tối nay','adv'],['dinner','bữa tối','n']], [['homework','bài tập về nhà','n'],['test','bài kiểm tra','n']], [['book','quyển sách','n']], [['start','bắt đầu','v'],['work','làm việc','v'],['leave','rời đi','v'],['early','sớm','adv'],['get there','đến đó','phr']], [['nice','đẹp','adj'],['tomorrow','ngày mai','adv'],['work','làm việc','v'],['give up','từ bỏ','phr']]]
};
function extend(id,index,words){const seen=new Set(words.map(w=>w[0].toLowerCase()+'|'+w[2]));return [...words,...(supplements[id]?.[index]||[]).filter(w=>!seen.has(w[0].toLowerCase()+'|'+w[2]))]}
for(const u of units.filter(u=>u.id!=='present'))for(const [i,lesson]of u.sessions.entries())lesson.words=extend(u.id,i,lesson.words);
function vocabularyAnswer(word,response){
 if(typeof word!=='string'||typeof response!=='string')return false;
 const canonical=s=>s.normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/[.!?,]+$/,'').replace(/\s+/g,' ').trim();
 return [word,...variants(word)].some(x=>canonical(x)===canonical(response));
}
window.WynnlingContent={hints,candidates,extend,vocabularyAnswer};
})();
