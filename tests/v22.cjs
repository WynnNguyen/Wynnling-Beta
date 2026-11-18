const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(require('node:path').join(__dirname,'..',f),'utf8');
const window={};new Function('window',read('v21-checker.js'))(window);const {grade}=window.WynnlingV21;
const cases=[
 ['I have breakfast at seven.','I eat breakfast at seven.',true],
 ['She will not come tomorrow.',"She won’t come tomorrow.",true],
 ['He is watching television.','He is watching TV.',true],
 ['I am going to the supermarket.',"I’m going to the supermarket.",true],
 ['I usually go to bed early.','I normally go to bed early.',true],
 ['After dinner, I do my homework.','  after  dinner I do my homework  ',true],
 ['She goes to school every day.','She walks to school every day.',false],
 ['Does she play tennis?','She does play tennis.',false],
 ['I will study English tonight.','I will study English this evening.',true],
 ['I usually study English in the evening.','I usually study English tonight.',false],
 ['I study every day.','I study tomorrow.',false],
 ['I work in the morning.','I work this morning.',false],
 ['We play every week.','We play next week.',false],
 ['I read every night.','I read tonight.',false],
 ['She is working now.','She is working usually.',false],
 ['She will not go to school tomorrow.','She not go to school tomorrow.',false],
 ['They will not play football.','They will not playing football.',false],
 ['She will go tomorrow.','She doesn’t will go tomorrow.',false],
 ['I usually have breakfast at seven.','She usually have breakfast at seven.',false],
 ['She usually studies English.','She often studies English.',false],
 ['I swim at the swimming pool on Sundays.','I swim at the pool every Sunday.',true],
 ['Let’s eat, Grandma.','Let’s eat Grandma.',false],
 ['She works every day.','She work every day.',false],
 ['They are watching TV.','They is watching TV.',false],
 ['I will not come tomorrow.',"I’ll not come tomorrow.",true]
];
for(const [model,input,ok]of cases)assert.equal(grade({dir:'vi',model},input).status==='correct',ok,model+' / '+input);
const src=read('v22-everyday.js');const u4=new Function(src.slice(src.indexOf('const days='),src.indexOf('const unit4='))+'return {numWords,numericAnswer,freshQuestions};')();
for(const value of [0,1,9,10,21,99,105,340,1000,1005,10010,125000,1000001,7250000,12300000,100000005,999999999]){
 const words=u4.numWords(value);assert.ok(words&&!words.includes('billion'));assert.ok(u4.numericAnswer({kind:'number',value,mode:'words'},words));assert.ok(u4.numericAnswer({kind:'number',value,mode:'words'},words.replaceAll(' and ',' ').replaceAll('-',' ')));assert.ok(u4.numericAnswer({kind:'number',value,mode:'digits'},value.toLocaleString('en-US')));
}
assert.equal(u4.numWords(1000000000),'');assert.equal(u4.numWords(-1),'');
for(const input of ['1.05','1,05','105x','-105','1000000000'])assert.equal(u4.numericAnswer({kind:'number',value:105,mode:'digits'},input),false);
const bands=new Set();for(let j=0;j<100;j++)for(const si of [0,3,4])for(const q of u4.freshQuestions(si,'practice',30)){
 if(q.kind==='number'||q.kind==='money'){assert.ok(q.value>=0&&q.value<=999999999);bands.add(String(q.value).length);assert.ok(u4.numericAnswer({...q,mode:'words'},u4.numWords(q.value)+(q.kind==='money'?' dong':'')))}
}
assert.equal(bands.size,9);
// Execute the actual ledger with a minimal renderer; duplicate checks and review never alter originals.
let html='',ctx={window:{addEventListener(){}},document:{addEventListener(){}},escapeHtml:x=>String(x),language:'en',view:'',shell:x=>{html=x}};
vm.createContext(ctx);vm.runInContext(read('v22-attempts.js'),ctx);const A=ctx.window.WynnlingAttempts;
A.begin({restart(){}});A.record(0,{prompt:'p',model:'right'},'wrong',false,x=>x==='right');A.record(0,{},'right',true,()=>true);A.record(1,{prompt:'p2',model:'yes'},'yes',true,x=>x==='yes');A.finish();assert.match(html,/1\/2/);A.review();assert.match(html,/1\/1/);assert.match(html,/Previous answer: wrong/);A.input('right');A.check();A.check();A.next();assert.match(html,/1\/1/);A.results();assert.match(html,/1\/2/);assert.equal(A.state().records.size,2);
A.begin({restart(){}});A.record(0,{prompt:'p'},'yes',true,()=>true);A.finish();A.review();assert.match(html,/no mistakes/);
console.log('v22: 25 semantic cases, numerical boundaries/9 bands, 9,000 generated items, immutable ledger and mistake review passed.');
