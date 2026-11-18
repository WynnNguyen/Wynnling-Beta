// Run every shipped script, in HTML order, to exercise all lesson engines without a browser.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const storage=new Map(),app={innerHTML:''};const doc={documentElement:{lang:'en'},querySelector:s=>s==='#app'?app:null,querySelectorAll:()=>[],getElementById:()=>null,addEventListener(){},head:{append(){}},body:{append(){}},createElement:()=>({textContent:'',classList:{add(){},toggle(){}},setAttribute(){},appendChild(){},append(){}})};
const ctx={document:doc,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console:{info(){},warn(){},log(){}},setTimeout:()=>0,clearTimeout(){},alert(){},Date,Math};ctx.window=ctx;ctx.addEventListener=()=>{};ctx.scrollTo=()=>{};vm.createContext(ctx);
const scripts=[...read('index.html').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);for(const file of scripts)vm.runInContext(read(file),ctx,{filename:file});

module.exports={ctx,run:s=>vm.runInContext(s,ctx),app,read};
