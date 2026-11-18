/* Reviewed Vietnamese labels; language switching leaves lesson IDs and content unchanged. */
(function(){
'use strict';
const names=[
 ['Thì hiện tại đơn','Thì hiện tại tiếp diễn','Thì tương lai đơn','Số đếm, ngày tháng và giờ giấc'],
 [
  ['Sinh hoạt và thói quen','Gia đình và các mối quan hệ','Trường học và học tập','Công việc và nghề nghiệp','Sở thích và thời gian rảnh','Tính cách, cảm xúc và sở thích'],
  ['Hoạt động đang diễn ra','Thể thao và vận động','Nhà cửa và việc nhà','Học tập và công việc','Đi lại trong thành phố'],
  ['Kế hoạch cho ngày mai','Lời hứa và sự giúp đỡ','Lời mời và quyết định','Hỏi thông tin về tương lai','Dự đoán và hy vọng'],
  ['Số đếm và số thứ tự','Thứ, tháng và ngày','Cách đọc giờ','Tiền và giá cả','Luyện tập tổng hợp']
 ]
];
const originals=units.map(u=>({name:u.name,sub:u.sub,sessions:u.sessions.map(s=>({name:s.name,focus:s.focus}))}));
function localize(){
 const vi=language==='vi';
 units.forEach((u,i)=>{u.name=vi?names[0][i]:originals[i].name;u.sub=vi?['Thói quen và sinh hoạt hằng ngày','Hành động đang diễn ra và tình huống tạm thời','Dự đoán, lời hứa, lời mời và quyết định','Số đếm, ngày tháng, giờ giấc và giá cả'][i]:originals[i].sub;
 u.sessions.forEach((s,j)=>{s.name=vi?names[1][i][j]:originals[i].sessions[j].name;
 if(i===1)s.focus=vi?['Khẳng định · be + V-ing','Phủ định · be + not + V-ing','Câu hỏi có/không · be + S + V-ing','Câu hỏi với từ để hỏi','Ôn tập thì hiện tại tiếp diễn'][j]:originals[i].sessions[j].focus;
 if(i===2)s.focus=vi?['Khẳng định · will + V₀','Phủ định · will not + V₀','Câu hỏi có/không · Will + S + V₀','Câu hỏi với từ để hỏi · WH + will','Ôn tập thì tương lai đơn'][j]:originals[i].sessions[j].focus;
 });
 if(tenseGuides[u.id])tenseGuides[u.id].title=u.name;
 });
}
Object.assign(labels.vi,{units:'Các bài học',overview:'Tổng quan về thì',grammar:'Công thức ngữ pháp',formula:'Xem công thức',wordHint:'Gợi ý từ vựng',newRound:'Các cặp tiếp theo',roundComplete:'Bạn đã nối đúng tất cả các cặp trong lượt này.',matchSub:'Chọn một từ ở cột trái rồi chọn nghĩa tương ứng ở cột phải. Mỗi lượt có tối đa năm cặp.',note:'Mỗi buổi kết hợp học từ vựng, luyện ngữ pháp và luyện dịch hai chiều.',drillDone:'Đã hoàn thành bài luyện ngữ pháp'});
labels.en.roundComplete='All pairs in this round are correct!';
// These are structural rules, not word-for-word Vietnamese translations of be.
compactRules.continuous.negative.vi='I → am not + V-ing\nHe/She/It hoặc danh từ số ít → is not + V-ing\nYou/We/They hoặc danh từ số nhiều → are not + V-ing\nTiếng Việt có thể dùng: Hiện giờ ... không ...';
compactRules.continuous.affirmative.vi='I → am + V-ing\nHe/She/It hoặc danh từ số ít → is + V-ing\nYou/We/They hoặc danh từ số nhiều → are + V-ing\nDiễn tả hành động đang diễn ra.';
const oldRender=render;
render=function(){localize();oldRender()};
// Session links can bypass render; localize at those entry points as well.
const oldGo=goSession;goSession=function(u,s){localize();return oldGo(u,s)};
window.WynnlingVietnamese={localize,names};
localize();render();
})();
