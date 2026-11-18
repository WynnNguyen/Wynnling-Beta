const grammarWordMeanings={
 'where':'ở đâu','when':'khi nào','why':'tại sao','how':'như thế nào','what':'cái gì / việc gì','who':'ai','how long':'bao lâu',
 'always':'luôn luôn','usually':'thường','sometimes':'thỉnh thoảng','rarely':'hiếm khi','never':'không bao giờ',
 'study':'học','goes':'đi','works':'làm việc','have':'ăn / có','watches':'xem',
 'am':'là / ở (với I)','is':'là / ở (số ít)','are':'là / ở (số nhiều / you)',
 'do':'trợ động từ với I/you/we/they','does':'trợ động từ với he/she/it',
 'do not':'không (I/you/we/they)','does not':'không (he/she/it)',
 'reading':'đọc (dạng V-ing)','cooking':'nấu ăn (dạng V-ing)','playing':'chơi (dạng V-ing)','listening':'nghe (dạng V-ing)','studying':'học (dạng V-ing)',
 'am not':'dạng phủ định của am (đi với I)','is not':'dạng phủ định của is (đi với he/she/it hoặc danh từ số ít)','are not':'dạng phủ định của are (đi với you/we/they hoặc danh từ số nhiều)',
 'will':'sẽ','will not':'sẽ không','be':'là / ở / trở nên',
 'finish':'hoàn thành','start':'bắt đầu','prepare':'chuẩn bị','visit':'thăm','make':'làm / tạo'
};
const precedingDrill13=drill;
drill=function(){precedingDrill13();if(!drillChecked)return;const item=grammarItems[drillTense][drillType][drillIndex];if(!item)return;const correct=drillAnswers[drillAnswers.length-1]?.correct;
  const sentence=item[0].replace('_____',`%%ANSWER%%`).replace(/\s*\([^)]*\)/g,'');
  const completed=escapeHtml(sentence).replace('%%ANSWER%%',`<span class="filled-answer ${correct?'':'incorrect-attempt'}">${escapeHtml(item[1])}</span>`);
  const question=document.querySelector('.practice .cloze');if(question)question.innerHTML=completed;
  document.querySelector('.practice .prompt')?.classList.add('corrected-prompt');
  const meaning=grammarWordMeanings[item[1].toLowerCase()]||'';
  const panel=document.querySelector('.practice .feedback');if(!panel)return;
  const wording=meaning?`${escapeHtml(item[1])} — ${escapeHtml(meaning)}`:escapeHtml(item[1]);
  if(correct){panel.innerHTML=`<div class="compact-result"><span>✓ ${language==='vi'?'Chính xác':'Correct'}</span><span class="answer-meaning">${wording}</span></div>`}
  else{const first=panel.querySelector('p');if(first)first.innerHTML=`<b>${language==='vi'?'Từ đúng':'Correct form'}:</b> <span class="answer-meaning">${wording}</span>`}
};
