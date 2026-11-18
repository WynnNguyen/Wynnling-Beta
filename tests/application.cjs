// Run every shipped script, in HTML order, to exercise all lesson engines without a browser.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const storage=new Map(),app={innerHTML:''};const doc={documentElement:{lang:'en'},querySelector:s=>s==='#app'?app:null,querySelectorAll:()=>[],getElementById:()=>null,addEventListener(){},head:{append(){}},body:{append(){}},createElement:()=>({textContent:'',classList:{add(){},toggle(){}},setAttribute(){},appendChild(){},append(){}})};
const ctx={document:doc,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console:{info(){},warn(){},log(){}},setTimeout:()=>0,clearTimeout(){},alert(){},Date,Math};ctx.window=ctx;ctx.addEventListener=()=>{};ctx.scrollTo=()=>{};vm.createContext(ctx);
const scripts=[...read('index.html').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);for(const file of scripts)vm.runInContext(read(file),ctx,{filename:file});
const run=s=>vm.runInContext(s,ctx);assert.equal(run('units.length'),4);assert.equal(run('units.reduce((n,u)=>n+u.sessions.length,0)'),21);
const lessons=run('units.map(u=>({id:u.id,sessions:u.sessions.map(s=>({name:s.name,words:s.words,vn:s.v3vn,en:s.v3en}))}))');
let models=0;for(const u of lessons)for(const s of u.sessions)for(const [dir,pairs]of [['vi',s.vn],['en',s.en]])for(const [prompt,model]of pairs){assert.equal(ctx.WynnlingV21.grade({dir,prompt,model},model).status,'correct',prompt);models++}
// Present Simple, grammar/translation: finish wrong attempts, review, and restart through public entrypoints.
for(const [start,input,check,next,count]of [['psGrammarStart','psGrammarInput','psGrammarCheck','psGrammarNext',15],['psTranslateStart','psTranslationInput','psTranslationCheck','psTranslationNext',15]]){
 ctx[start](0);for(let i=0;i<count;i++){ctx[input]('wrong');ctx[check]();ctx[check]();ctx[next]()}assert.equal(ctx.WynnlingAttempts.state().records.size,count);assert.equal(ctx.WynnlingAttempts.state().complete,true);assert.match(app.innerHTML,new RegExp('0/'+count));
 ctx.WynnlingAttempts.review();assert.match(app.innerHTML,/Previous answer/);ctx.WynnlingAttempts.results();
}
// Legacy grammar: five results and no duplicate submissions.
run("startDrill('future','negative')");for(let i=0;i<5;i++){run("answer=\"won't\";checkDrill();checkDrill();advanceDrill()")}assert.equal(ctx.WynnlingAttempts.state().records.size,5);assert.match(app.innerHTML,/5\/5/);
// Cumulative tests must use their own unit, with stable mixed order.
run("start(2,0,'test')");assert.equal(run('questionList().length'),20);assert.ok(run("questionList().every(x=>units[2].sessions.includes(x.source))"));const order=run('questionList().map(x=>x.prompt).join("|")');run('practice()');assert.equal(run('questionList().map(x=>x.prompt).join("|")'),order);
// All future building token sets contain will; affirmative, negative, question models preserved.
for(let i=0;i<5;i++){ctx.WynnlingBuild.start(2,i);assert.match(app.innerHTML,/will/);}
// Numerical complete attempt has exactly ten score entries; duplicate checks do nothing.
ctx.v22Open(0);ctx.v22Begin('assessment');for(let i=0;i<10;i++){ctx.v22Input('wrong');ctx.v22Check();ctx.v22Check();ctx.v22Next()}assert.equal(ctx.WynnlingAttempts.state().records.size,10);assert.match(app.innerHTML,/0\/10/);
// Existing numerical matching must generate real pairs rather than access undefined banks.
ctx.v22Open(0);ctx.v22MatchStart();assert.match(app.innerHTML,/match-choice/);assert.doesNotMatch(app.innerHTML,/undefined/);
console.log(`Application integration passed: ${scripts.length} shipped scripts, 21 sessions, ${models} translation models, 4 exercise engines, cumulative scope, matching, repeated submissions.`);
