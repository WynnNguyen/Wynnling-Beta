/* Run with: node tests/regression.cjs */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=name=>fs.readFileSync(path.join(root,name),"utf8");
const scripts=fs.readdirSync(root).filter(name=>name.endsWith(".js"));
for(const file of scripts)assert.doesNotThrow(()=>new Function(read(file)),file+" syntax");
const everyday=read("v22-everyday.js");
const core=everyday.slice(everyday.indexOf("const days="),everyday.indexOf("const unit4="));
const u4=new Function(core+"return {numericAnswer,freshQuestions,numWords};")();
assert.equal(u4.numericAnswer({kind:"date",mode:"words",day:17,month:11,year:2026},"undefined"),false);
assert.equal(u4.numericAnswer({kind:"date",mode:"words",day:17,month:11,year:2026},"November seventeenth"),true);
assert.match(everyday,/englishTime\(q\.hour,q\.minute,"past"\)\+\(q\.hour<12\?" a\.m\.":" p\.m\."\)/);
for(let session=0;session<5;session++){
 for(const [mode,count] of [["practice",30],["listen",10],["assessment",session===4?20:10],["match",5]]){
  const questions=u4.freshQuestions(session,mode,count);
  assert.equal(questions.length,count,"Unit 4 "+session+" "+mode+" count");
  const signatures=questions.map(q=>[q.kind,q.value,q.day,q.month,q.hour,q.minute].join("|"));
  assert.equal(new Set(signatures).size,count,"Unit 4 "+session+" "+mode+" duplicates");
 }
}
let largeMoney=false;
for(let i=0;i<20;i++)if(u4.freshQuestions(3,"practice",30).some(q=>q.value>=1000000))largeMoney=true;
assert.ok(largeMoney,"Money practice should include millions");
const ps=read("present-simple-v20.js");
const pack=JSON.parse(ps.slice(ps.lastIndexOf("})([")+3,-3));
assert.equal(pack.length,6);
for(const [index,session] of pack.entries()){
 assert.equal(session.words.length,28,"vocab "+index);
 assert.equal(session.grammar.length,15,"grammar "+index);
 assert.equal(session.translations.length,15,"translation "+index);
 assert.equal(session.translations.filter(q=>q.dir==="vi").length,10);
 assert.equal(session.translations.filter(q=>q.dir==="en").length,5);
 for(const word of session.words){
  const pos=/^(n|v|adj|adv|phr|prep)$/.test(word[1])?word[1]:word[2];
  assert.ok(!(pos==="v"&&/\s/.test(word[0])),"multiword verb category "+word[0]);
 }
}
assert.match(ps,/vocabProgress\[key\]/,"Vocab quiz must save to progress");
assert.match(ps,/\[0,4,8,10,13\]/,"Cumulative test must include both directions");
const checkerSource=read("v21-checker.js"),window={};
new Function("window",checkerSource)(window);
const grade=window.WynnlingV21.grade;
assert.notEqual(grade({dir:"vi",model:"She usually studies English."},"She often studies English.").status,"correct");
const stickerSource=read("v17.js");
assert.match(stickerSource,/\.vocab-sticker,\.v24-topic-icon/,"Prevent duplicate stickers");
const html=read("index.html");
assert.ok(html.indexOf("v26-compact-layout.css")>html.indexOf("v17.css"),"Compact styles should be last");
process.stdout.write("Wynnling regression checks passed ("+scripts.length+" scripts).\\n");
