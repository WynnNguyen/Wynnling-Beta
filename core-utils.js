/* Shared, dependency-free data/storage primitives. Loaded before the legacy scripts. */
(function(){
'use strict';
const memory=new Map(),warnings=new Set();
const warn=key=>{if(!warnings.has(key)){warnings.add(key);console.warn('Wynnling: browser storage unavailable or invalid:',key)}};
const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const finite=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
function getItem(key){if(memory.has(key))return memory.get(key);try{return localStorage.getItem(key)}catch{warn(key);return null}}
function setItem(key,value){memory.set(key,String(value));try{localStorage.setItem(key,String(value));return true}catch{warn(key);return false}}
function readObject(key){
 let data;try{data=JSON.parse(getItem(key)||'{}')}catch{warn(key);return {}}
 if(!object(data)){warn(key);return {}}
 const out={};for(const [k,v]of Object.entries(data)){
  if(['__proto__','constructor','prototype'].includes(k))continue;
  if(/grammar-progress|everyday-progress/.test(key)){const max=/grammar-progress/.test(key)?5:k==='assessment-4'?20:k.startsWith('assessment-')||k.endsWith('-listen')?10:30;if(finite(v)&&v<=max)out[k]=v;else warn(key);continue}
  if(!object(v))continue;
  const row={};for(const [field,value]of Object.entries(v)){
   if(['__proto__','constructor','prototype'].includes(field))continue;
   if(field==='assisted'&&/present-simple/.test(key)){row[field]=value===true;continue}
   if(['attempts','correct','assisted','tries','due','streak','quizBest'].includes(field)){if(finite(value))row[field]=value;continue}
   if(['complete','lastCorrect'].includes(field)){row[field]=value===true;continue}
   if(/translation-review/.test(key)&&!finite(value))continue;
   if(field==='seen'){row.seen=Array.isArray(value)?[...new Set(value.filter(x=>Number.isInteger(x)&&x>=0))]:[]}
   else if(typeof value==='boolean'||typeof value==='string'||value===null||finite(value))row[field]=value;
  }
  if(/vocab-progress/.test(key)){row.seen??=[];if(!finite(row.quizBest)||row.quizBest>10)row.quizBest=null}
  out[k]=row;
 }
 return out;
}
function shuffle(items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function translation(item){return !!item&&typeof item.prompt==='string'&&item.prompt.trim()&&typeof item.model==='string'&&item.model.trim()&&['vi','en','en-vi','vi-en'].includes(item.dir)}
function uniqueQuestions(items){const seen=new Set();return (Array.isArray(items)?items:[]).filter(x=>{if(!translation(x))return false;const key=[x.dir,x.prompt,x.model].map(v=>v.toLowerCase().replace(/[.!?,]/g,'').trim()).join('|');if(seen.has(key))return false;seen.add(key);return true})}
function validSession(u,s){return Number.isInteger(u)&&Number.isInteger(s)&&!!units[u]?.sessions?.[s]}
function wordBank(words){return Array.isArray(words)&&words.length>0&&words.every(w=>Array.isArray(w)&&w.length===3&&w.every(x=>typeof x==='string'&&x.trim()))}
function unavailable(){window.WynnlingAttempts?.cancel();view='unavailable';shell('<div class="practice"><h1>'+(language==='vi'?'Chưa thể mở bài tập':'Exercise unavailable')+'</h1><p>'+(language==='vi'?'Bài tập này chưa có đủ câu hỏi hợp lệ. Hãy chọn một bài học khác.':'This exercise does not have enough valid questions. Please choose another lesson.')+'</p><button class="btn" onclick="navigate(\'curriculum\')">'+(language==='vi'?'Về bài học':'Back to lessons')+'</button></div>');return false}
window.WynnlingStorage={getItem,setItem,object:readObject};
window.WynnlingData={shuffle,translation,uniqueQuestions,validSession,wordBank,unavailable};
})();
