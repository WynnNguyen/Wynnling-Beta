const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{ctx,run,read}=require('./runtime.cjs');
const root=path.resolve(__dirname,'..'),html=read('index.html'),refs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(refs).size,refs.length,'Duplicate assets');for(const f of refs)assert.ok(fs.existsSync(path.join(root,f)),f);for(const f of fs.readdirSync(root).filter(x=>x.endsWith('.js')))new vm.Script(read(f),{filename:f});
const source=read('present-simple-v20.js'),pack=JSON.parse(source.slice(source.lastIndexOf('})([')+3,-3));const ids=pack.flatMap(p=>[...p.grammar,...p.translations].map(q=>q.id));assert.equal(new Set(ids).size,ids.length,'Duplicate question IDs');for(const p of pack){for(const q of p.grammar){assert.ok(q.prompt.includes('______')&&q.answer.trim())}for(const q of p.translations)assert.ok(q.model.trim()&&q.prompt.trim())}
for(const u of run('units'))for(const s of u.sessions)for(const w of s.words)assert.ok(Array.isArray(w)&&w.length===3&&w.every(x=>typeof x==='string'&&x.trim()),'Malformed vocabulary');
for(const tense of ['present','continuous','future'])for(const type of run(`Object.keys(grammarItems['${tense}'])`))run(`startDrill('${tense}','${type}')`);
for(let si=0;si<5;si++){
 ctx.WynnlingBuild.start(2,si);
 const pairs=run(`units[2].sessions[${si}].v3vn`);
 for(const [,model]of pairs)assert.match(ctx.WynnlingV21.basic(model),/\bwill\b/,'Future auxiliary');
}
for(const [model,input]of [['Does she play tennis?','She does play tennis.'],['She will not come tomorrow.','She not come tomorrow.'],['I study in the evening.','I study tonight.']])assert.equal(ctx.WynnlingV21.grade({dir:'vi',model},input).status,'wrong');
assert.equal(ctx.WynnlingV21.grade({dir:'vi',model:'I usually wake up early.'},'I wake usually up early.').code,'grammar');
for(const [model,input,ok]of [['After dinner, I do homework.','After dinner I do homework.',true],['My parents are kind, and they help me.','My parents are kind and they help me.',true],['I am cooking, Mum.','I am cooking Mum.',false],['After dinner I eat, Grandma.','After dinner I eat Grandma.',false],['My brother, who lives in London, is a teacher.','My brother who lives in London is a teacher.',false]])assert.equal(ctx.WynnlingV21.grade({dir:'vi',model},input).status==='correct',ok);
for(let ui=0;ui<3;ui++)for(let si=0;si<run(`units[${ui}].sessions.length`);si++){
 run(`unit=${ui};session=${si};quizIndex=0;quizDeck=[0];quizChoiceCache={}`);
 for(let wi=0;wi<run('current().words.length');wi++){
  const options=run(`quizOptions(${wi})`);assert.equal(new Set(options).size,options.length,'Duplicate visible quiz options');
 }
}
let handlers=0;const decode=s=>s.replace(/&quot;/g,'"').replace(/&#(?:39|x27);/gi,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
function scan(){for(const match of require('./runtime.cjs').app.innerHTML.matchAll(/\bon\w+\s*=\s*(?:"([^"]*)"|'([^']*)')/g)){const code=decode(match[1]??match[2]);new vm.Script('function handler(event){'+code+'}',{filename:'rendered-handler'});handlers++}}
for(const lang of ['en','vi']){
 run(`language='${lang}'`);
 for(let ui=0;ui<run('units.length');ui++)for(let si=0;si<run(`units[${ui}].sessions.length`);si++)for(const action of [`goSession(${ui},${si})`,`unit=${ui};session=${si};vocabulary()`,...(ui===3?[]:[`start(${ui},${si})`,`startVocabQuiz(${ui},${si})`])]){run(action);scan()}
 for(const tense of ['present','continuous','future'])for(const type of run(`Object.keys(grammarItems['${tense}'])`)){run(`startDrill('${tense}','${type}')`);scan()}
}
assert.ok(handlers>2000);
console.log(`Integrity checks passed: ${refs.length} unique assets, ${ids.length} Present Simple IDs, valid vocabulary/formulas, unique quiz options, ${handlers} compiled inline handlers across both languages.`);
