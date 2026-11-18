// No installation or third-party dependencies required.
const {execFileSync}=require('node:child_process');
for(const file of ['regression.cjs','v22.cjs','application.cjs','content-quality.cjs','audit.cjs','integrity.cjs'])execFileSync(process.execPath,[require('node:path').join(__dirname,file)],{stdio:'inherit'});
