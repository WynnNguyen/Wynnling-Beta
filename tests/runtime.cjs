// Isolated script-order harness. UI/viewport behavior is checked separately in the browser.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
function createRuntime(options={}){
 const storage=new Map(Object.entries(options.storage||{})),timers=[],listeners=[],logs=[];let renders=0,html='';
 const app={get innerHTML(){return html},set innerHTML(value){renders++;html=value}};
 const doc={documentElement:{lang:'en'},querySelector:s=>s==='#app'?app:null,querySelectorAll:()=>[],getElementById:()=>null,addEventListener:(...args)=>listeners.push(['document',...args]),head:{append(){}},body:{append(){}},createElement:()=>({textContent:'',classList:{add(){},toggle(){}},setAttribute(){},appendChild(){},append(){}})};
 const ctx={document:doc,localStorage:{getItem:k=>{if(options.storageThrows)throw Error('blocked');return storage.get(k)??null},setItem:(k,v)=>{if(options.storageThrows||options.storageWriteThrows)throw Error('quota');storage.set(k,v)}},console:{info(...x){logs.push(x)},warn(...x){logs.push(x)},log(){}},setTimeout:fn=>timers.push(fn),clearTimeout(){},alert(){},Date,Math:options.math||Math};
 ctx.window=ctx;ctx.addEventListener=(...args)=>listeners.push(['window',...args]);ctx.scrollTo=()=>{};vm.createContext(ctx);
 const scripts=[...read('index.html').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
 for(const file of scripts)vm.runInContext(options.sourceTransform?.(file,read(file))??read(file),ctx,{filename:file});
 return {ctx,run:s=>vm.runInContext(s,ctx),app,read,storage,timers,listeners,logs,scripts,get renders(){return renders}};
}
module.exports={...createRuntime(),createRuntime};
