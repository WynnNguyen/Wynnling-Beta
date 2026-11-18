/* Shared attempt ledger: first submissions are immutable; reviews have separate scores. */
(function(){
'use strict';
let active=null,review=null,pending=null;
const e=x=>escapeHtml(String(x??''));
const text=(en,vi)=>language==='vi'?vi:en;
function begin(config){active={...config,records:new Map(),complete:false};review=null;}
function record(key,item,response,correct,validate,options=[]){
 if(!active||active.complete||active.records.has(key))return;
 active.records.set(key,{item:{...item},response,correct,validate,options:[...options]});
}
function result(){
 if(!active)return;
 active.complete=true;view='v22Results';
 const rows=[...active.records.values()],right=rows.filter(r=>r.correct).length,wrong=rows.length-right;
 shell(`<div class="practice"><h1>${text('Exercise complete','Hoàn thành bài tập')}</h1><div class="card"><h2>${right}/${rows.length}</h2><p>${text('Correct','Đúng')}: ${right} · ${text('Incorrect','Sai')}: ${wrong}</p>${!wrong?'<p>'+text('Perfect! There are no mistakes to review.','Hoàn hảo! Không có câu sai để ôn lại.')+'</p>':''}<div class="actions"><button class="btn secondary" onclick="WynnlingAttempts.review()">${text('Review Mistakes','Ôn lại câu sai')}</button><button class="btn" onclick="WynnlingAttempts.restart()">${text('Try Again','Làm lại')}</button><button class="btn outline" onclick="WynnlingAttempts.lessons()">${text('Back to Lessons','Về bài học')}</button></div></div></div>`);
}
function showReview(){
 view='v22Mistakes';const r=review.rows[review.index];
 if(!r){shell(`<div class="practice"><h1>${text('Review complete','Hoàn thành ôn tập')}</h1><div class="card"><p>${text('Mistakes corrected','Số câu đã sửa đúng')}: ${review.correct}/${review.rows.length}</p><p>${text('Your original score is unchanged.','Điểm ban đầu không thay đổi.')}</p><button class="btn" onclick="WynnlingAttempts.results()">${text('Back to results','Về kết quả')}</button></div></div>`);return;}
 const controls=r.options.length?`<div class="vocab-check-choices">${r.options.map(o=>`<button class="btn ${review.input===o?'':'outline'}" aria-pressed="${review.input===o}" ${review.checked?'disabled':''} onclick="WynnlingAttempts.pick(${e(JSON.stringify(o))})">${e(o)}</button>`).join('')}</div>`:`<label for="mistakeAnswer">${text('Your new answer','Câu trả lời mới')}</label><textarea id="mistakeAnswer" class="answer" ${review.checked?'disabled':''} oninput="WynnlingAttempts.input(this.value)">${e(review.input)}</textarea>`;
 shell(`<div class="practice"><h1>${text('Review Mistakes','Ôn lại câu sai')} · ${review.index+1}/${review.rows.length}</h1><div class="card"><h2>${e(r.item.prompt)}</h2><p>${text('Previous answer','Câu trả lời trước')}: ${e(r.response)}</p>${controls}<button class="btn" ${review.checked?'disabled':''} onclick="WynnlingAttempts.check()">${text('Check answer','Kiểm tra')}</button>${review.checked?`<div class="feedback ${review.ok?'':'review'}"><b>${review.ok?text('Correct!','Đúng!'):text('Incorrect','Chưa đúng')}</b><p>${e(r.item.model)}</p></div><button class="btn" onclick="WynnlingAttempts.next()">${text('Next','Tiếp theo')} →</button>`:''}<button class="btn outline" onclick="WynnlingAttempts.results()">${text('Back to results','Về kết quả')}</button></div></div>`);
}
function confirmAction(kind,action){
 pending=action;
 const restart=kind==='restart';
 const dialog=document.createElement('dialog');dialog.id='wynnling-confirm';
 dialog.innerHTML=`<p>${restart?text('Are you sure you want to restart this exercise? Your answers from this attempt will be cleared.','Bạn có chắc muốn làm lại bài tập này không? Các câu trả lời của lượt hiện tại sẽ bị xóa.'):text("You haven’t finished this exercise. Are you sure you want to leave? Your current progress will be lost.",'Bạn chưa hoàn thành bài tập. Bạn có chắc muốn thoát không? Tiến độ của lượt hiện tại sẽ không được lưu.')}</p><div class="actions"><button class="btn outline" data-cancel>${restart?text('Cancel','Hủy'):text('Continue Learning','Tiếp tục học')}</button><button class="btn" data-confirm>${restart?text('Restart','Làm lại'):text('Leave Exercise','Thoát bài tập')}</button></div>`;
 document.body.append(dialog);dialog.querySelector('[data-cancel]').onclick=()=>{pending=null;dialog.close();dialog.remove()};dialog.querySelector('[data-confirm]').onclick=()=>{const fn=pending;pending=null;active=null;dialog.close();dialog.remove();fn()};dialog.addEventListener('cancel',()=>{pending=null;dialog.remove()});dialog.showModal();
}
function unfinished(){return active&&!active.complete;}
window.WynnlingAttempts={begin,record,finish:result,results:result,unfinished,
 review(){if(!active)return;const rows=[...active.records.values()].filter(r=>!r.correct);if(!rows.length)return result();review={rows,index:0,input:'',checked:false,correct:0};showReview()},
 input(x){if(!review.checked)review.input=x},pick(x){if(!review.checked){review.input=x;showReview()}},
 check(){if(review.checked||!review.input.trim())return;review.ok=!!review.rows[review.index].validate(review.input);review.checked=true;if(review.ok)review.correct++;showReview()},
 next(){if(!review.checked)return;review.index++;review.input='';review.checked=false;showReview()},
 restart(){const fn=active?.restart;if(fn)confirmAction('restart',fn)},
 lessons(){active=null;view='curriculum';render()},
 leave(fn){if(unfinished())confirmAction('leave',()=>{view='curriculum';render()});else{active=null;fn()}},
 state:()=>active,render(){if(view==='v22Results')result();else showReview()}
};
window.addEventListener('beforeunload',ev=>{if(unfinished()){ev.preventDefault();ev.returnValue=''}});
// Capture navigation before inline handlers can mutate unit/session or replace the exercise.
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button');if(!b||!unfinished()||b.closest('dialog'))return;
 const code=b.getAttribute('onclick')||'';
 if(/navigate\(|goSession\(|psOpen\(|v22Hub\(|v22All\(|setTense\(|practiseRelatedGrammar\(/.test(code)){
 ev.preventDefault();ev.stopImmediatePropagation();window.WynnlingAttempts.leave(()=>{});
 }
},true);
})();
