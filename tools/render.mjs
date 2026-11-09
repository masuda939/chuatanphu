import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:'new', args:['--no-sandbox','--enable-unsafe-swiftshader']});
const page = await browser.newPage();
page.on('console',m=>console.log('console',m.type(),m.text().slice(0,200)));
page.on('pageerror',e=>console.log('pageerror',String(e).slice(0,300)));
await page.goto('http://localhost:8123/render.html',{waitUntil:'networkidle0',timeout:90000});
let ok=false;
for (let i=0;i<60;i++){ ok=await page.evaluate(()=>!!(window.__ping&&window.__ping())); if(ok) break; await new Promise(r=>setTimeout(r,1000)); }
console.log('ready', ok);
await page.screenshot({path:'C:/Users/PTC/.deepai-code/scratch/2026-11-08-t-m-cho-m-nh-552cadba/public/assets/buddha-statue.png',omitBackground:true});
await browser.close();
console.log('rendered');
