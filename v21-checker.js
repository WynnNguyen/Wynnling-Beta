/* Context-preserving approved equivalences; no similarity-based automatic credit. */
(function(){
'use strict';
const contractions={"won't":"will not","can't":"cannot","don't":"do not","doesn't":"does not","isn't":"is not","aren't":"are not","wasn't":"was not","weren't":"were not","i'm":"i am","you're":"you are","we're":"we are","they're":"they are","he's":"he is","she's":"she is","it's":"it is","i'll":"i will","you'll":"you will","he'll":"he will","she'll":"she will","we'll":"we will","they'll":"they will","it'll":"it will"};
function basic(s){let x=String(s||'').normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").trim();for(const [a,b] of Object.entries(contractions))x=x.replace(new RegExp('\\b'+a+'\\b','g'),b);return x.replace(/[.!?]+$/,'').replace(/\s+/g,' ').trim()}
function normal(s,vi=false){let x=basic(s);
 // Only known harmless comma positions are optional. Keep vocatives and other clause punctuation.
 x=x.replace(/,\s*(?=(?:and|but|or|so|yet|even when|và|nhưng|nên|hoặc)(?:\s|$))/g,' ')
 .replace(/^((?:after|before) (?:breakfast|lunch|dinner|school|work|class)|in the (?:morning|afternoon|evening)|tomorrow|today|tonight|now|usually|normally|sometimes|often|this (?:morning|afternoon|evening)|next (?:week|month|year)|sau bữa (?:sáng|trưa|tối)|vào buổi (?:sáng|chiều|tối)|hôm nay|ngày mai|hiện giờ|lúc này),\s*/,'$1 ').replace(/\s+/g,' ').trim();
 if(vi)return x.replace(/(^|\s)(?:cha|ba)(?= tôi| bạn| anh ấy| cô ấy| chúng tôi)/g,'$1bố').replace(/(^|\s)má(?= tôi| bạn| anh ấy| cô ấy| chúng tôi)/g,'$1mẹ').replace(/hằng ngày/g,'mỗi ngày');
 x=x.replace(/\b(eat|eats|eating) (breakfast|lunch|dinner)\b/g,(_,v,n)=>({eat:'have',eats:'has',eating:'having'}[v])+' '+n)
 .replace(/\bexams\b/g,'examinations').replace(/\bexam\b/g,'examination').replace(/\btelevision\b/g,'tv').replace(/\bnormally\b/g,'usually').replace(/\bthis evening\b/g,'tonight')
 .replace(/\bswimming pool\b/g,'pool').replace(/\bmom\b|\bmum\b/g,'mother').replace(/\bdad\b/g,'father')
 .replace(/\belder (sister|brother)\b/g,'older $1').replace(/\bon sundays\b/g,'every sunday');
 return x;
}
function ongoingVietnamese(s){return normal(s,true).replace(/^(?:hiện giờ|hiện tại|ngay lúc này|lúc này|bây giờ)\s+/,'').replace(/\s+(?:ngay lúc này|lúc này|bây giờ)$/,'').replace(/\s+(?:hiện|hiện giờ|hiện tại|đang) không\s+/,' không ')}
const times=s=>{const x=normal(s);return (x.match(/\b(?:tonight|this morning|this afternoon|tomorrow|today|every (?:day|night|week|morning|evening)|next (?:week|month|year)|in the (?:morning|evening|afternoon)|now|usually)\b/g)||[]).sort().join('|')};
function grade(item,response,lang='en'){
 if(!item||!['vi','en','vi-en','en-vi'].includes(item.dir)||typeof item.model!=='string'||!item.model.trim()||typeof response!=='string')return {status:'wrong',code:'invalid',category:lang==='vi'?'Chưa thể chấm':'Unavailable',message:lang==='vi'?'Câu hỏi hoặc câu trả lời không hợp lệ.':'The question or response is invalid.',confidence:0};
 const vi=item.dir==='en'||item.dir==='en-vi';const a=normal(response,vi),m=normal(item.model,vi);
 const messages={homework:['Use do homework: do/does homework, be doing homework, or will do homework. Write is used for an essay, paragraph or written answer.','Dùng do homework: do/does homework, be doing homework hoặc will do homework. Dùng write khi viết bài luận, đoạn văn hoặc câu trả lời.'],empty:['Write an answer first.','Hãy nhập câu trả lời.'],correct:['Correct! Meaning and grammar match.','Đúng! Ý nghĩa và ngữ pháp phù hợp.'],acceptable:['Acceptable! This expression has the same meaning.','Chấp nhận! Cách diễn đạt này có cùng ý nghĩa.'],time:['Check the time expression: tonight means this evening; in the evening describes a general time or routine.','Kiểm tra thời gian: tonight là tối nay; in the evening là vào buổi tối.'],subject:['Check the subject: keep the same person as the prompt.','Kiểm tra chủ ngữ: giữ đúng người trong câu gốc.'],grammar:['Check the auxiliary, verb form and word order for this tense.','Kiểm tra trợ động từ, dạng động từ và trật tự từ của thì đang học.'],meaning:['This answer changes or omits part of the meaning. Compare it with the model.','Câu trả lời thay đổi hoặc thiếu ý. Hãy đối chiếu đáp án mẫu.'],punctuation:['Keep punctuation that separates clauses or identifies the person being addressed.','Giữ dấu câu phân tách mệnh đề hoặc chỉ người được gọi.']};
 const result=(status,code)=>({status,category:lang==='vi'?(status==='correct'?(code==='acceptable'?'Cách diễn đạt được chấp nhận':'Chính xác'):'Chưa đúng'):(status==='correct'?(code==='acceptable'?'Acceptable':'Correct'):'Incorrect'),code,message:messages[code][lang==='vi'?1:0],reason:messages[code][lang==='vi'?1:0],confidence:status==='correct'?1:0});
 if(!a)return result('wrong','empty');
 if(!vi&&/\b(?:write|writes|writing|wrote|written)\s+(?:(?:my|your|his|her|our|their|the)\s+)?homework\b/i.test(response))return result('wrong','homework');
 if(!vi&&/\b(?:let us|let's) (?:eat|help|visit|call),/i.test(basic(item.model))!==/\b(?:let us|let's) (?:eat|help|visit|call),/i.test(basic(response)))return result('wrong','punctuation');
 const approved=[item.model,...(Array.isArray(item.accepted)?item.accepted:[]),...(Array.isArray(item.answers)?item.answers:[])].filter(x=>typeof x==='string');
 if(approved.some(x=>normal(x,vi)===a))return result('correct',basic(response).replace(/,/g,'')===basic(item.model).replace(/,/g,'')?'correct':'acceptable');
 if(a.replace(/,/g,'')===m.replace(/,/g,''))return result('wrong','punctuation');
 if(vi&&/\b(?:am|is|are) not \w+ing\b/.test(basic(item.prompt))&&!/\b(?:today|tonight|tomorrow|this|next|every)\b/.test(basic(item.prompt))&&approved.some(x=>ongoingVietnamese(x)===ongoingVietnamese(response)))return result('correct','acceptable');
 if(!vi){
 if(times(response)!==times(item.model))return result('wrong','time');
 if(a.split(' ').sort().join(' ')===m.split(' ').sort().join(' '))return result('wrong','grammar');
 const subject=s=>basic(s).match(/^(?:i|you|he|she|it|we|they)\b/)?.[0];
 if(subject(response)&&subject(item.model)&&subject(response)!==subject(item.model))return result('wrong','subject');
 if(/\b(?:will (?:not )?\w+(?:ing|ed|s)\b|does(?: not)? \w+s\b)|\b(?:he|she|it) (?:have|go|play|work|study)\b/.test(a)||/\bwill\b/.test(m)!==/\bwill\b/.test(a))return result('wrong','grammar');
 }
 return result('wrong','meaning');
}
window.WynnlingV21={version:'22',grade,normalize:normal,basic};
})();
