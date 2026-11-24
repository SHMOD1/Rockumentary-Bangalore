const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const SP='/tmp/claude-0/-home-user-DASHBOARD-CASE-STUDIES/573ba59d-e5f2-5406-845c-e9df8bbc9145/scratchpad', R='/home/user/rockumentary-bangalore/', OUTN=process.argv[2]||'rockumentary-poster-v2c';
const D=JSON.parse(fs.readFileSync(SP+'/v2/data.json','utf8'));
D.places.forEach(p=>{p.href=p.img?'data:image/jpeg;base64,'+fs.readFileSync(R+p.img).toString('base64'):'';});
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1300,height:1360}});
 await p.route('https://unpkg.com/**',r=>r.fulfill({path:SP+'/ml/package/dist/'+r.request().url().split('/dist/')[1]}));
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+SP+'/v2/map.html'); await p.waitForSelector('body[data-ready]',{timeout:180000});
 await p.evaluate(()=>Promise.all(['400 14px "Roboto Condensed"','500 14px "Roboto Condensed"','700 14px "Roboto Condensed"','900 14px "Roboto Condensed"','800 14px "Roboto Slab"','900 14px "Roboto Slab"'].map(f=>document.fonts.load(f))));
 const svg=await p.evaluate(D=>{
  const W=1587,H=2245,M=22,INK='#0b0c10',CREAM='#f3e9d2',BG='#23263a',YEL='#FFD54A',ERAS=D.ERAS;
  const f=n=>Math.round(n*10)/10, esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const cv=document.createElement('canvas').getContext('2d');
  const wrap=(t,font,w)=>{cv.font=font;const out=[];let cur='';t.split(' ').forEach(x=>{const tr=cur?cur+' '+x:x;if(cv.measureText(tr).width>w&&cur){out.push(cur);cur=x;}else cur=tr;});if(cur)out.push(cur);return out;};
  const tspans=(lines,x,lh)=>lines.map((l,i)=>`<tspan x="${x}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  // ---------- layout ----------
  const TW=112,TH=160,GX=(W-2*M-13*TW)/12, colX=i=>M+i*(TW+GX), TOP=232, BOT=H-M-TH;
  const sy0=TOP+TH, sgap=(BOT-sy0-10*TH)/11, sideY=j=>sy0+sgap+j*(TH+sgap);
  const slots=[];
  for(let i=1;i<=12;i++)slots.push([colX(i),TOP]);
  for(let j=0;j<10;j++)slots.push([colX(12),sideY(j)]);
  for(let i=12;i>=0;i--)slots.push([colX(i),BOT]);
  for(let j=9;j>=0;j--)slots.push([colX(0),sideY(j)]);
  const X0=M+TW+14, X1=W-M-TW-14, Y0=TOP+TH+14, MW=1291, MH=BOT-14-280-14-Y0, CY=Y0+MH+14, CH=BOT-14-CY;
  // ---------- map vectors ----------
  const pr=c=>{const q=map.project(c);return f(q.x)+','+f(q.y);};
  const lineD=g=>{const L=g.type==='LineString'?[g.coordinates]:g.type==='MultiLineString'?g.coordinates:[];return L.map(l=>'M'+l.map(pr).join('L')).join('');};
  const polyD=g=>{const P=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];return P.map(r=>r.map(l=>'M'+l.map(pr).join('L')+'Z').join('')).join('');};
  const q=id=>map.queryRenderedFeatures({layers:[id]}), polys=id=>q(id).map(x=>polyD(x.geometry)).join(''), lines=id=>q(id).map(x=>lineD(x.geometry)).join('');
  const z=map.getZoom(), rw=k=>{const t=(Math.pow(1.5,z-14)-1)/(Math.pow(1.5,3)-1);return f(3*k+9*k*t);};
  const parkD=polys('park')+polys('green');
  let HATCH='';for(let c=-MH;c<MW+20;c+=12)HATCH+=`M${c} ${MH}L${c+MH} 0`;
  let STR='';for(let c=-70;c<110;c+=11.3)STR+=`M${f(c)} 70L${f(c+70)} 0`;
  // pins
  const inside=[],out=[];
  D.places.forEach(p=>{const c=map.project([p.lng,p.lat]);p.x=p.ox=c.x;p.y=p.oy=c.y;(c.x>18&&c.x<MW-18&&c.y>18&&c.y<MH-18?inside:out).push(p);});
  for(let it=0;it<300;it++)for(let i=0;i<inside.length;i++)for(let j=i+1;j<inside.length;j++){const a=inside[i],bb=inside[j];let dx=bb.x-a.x,dy=bb.y-a.y,d=Math.hypot(dx,dy)||.1;if(d<33){const m=(33-d)/2;dx/=d;dy/=d;a.x-=dx*m;a.y-=dy*m;bb.x+=dx*m;bb.y+=dy*m;}}
  let leaders='';inside.forEach(p=>{if(Math.hypot(p.x-p.ox,p.y-p.oy)>3)leaders+=`<line x1="${f(p.ox)}" y1="${f(p.oy)}" x2="${f(p.x)}" y2="${f(p.y)}" stroke="${INK}" stroke-width="4"/><line x1="${f(p.ox)}" y1="${f(p.oy)}" x2="${f(p.x)}" y2="${f(p.y)}" stroke="${CREAM}" stroke-width="1.6"/><circle cx="${f(p.ox)}" cy="${f(p.oy)}" r="3.2" fill="${CREAM}" stroke="${INK}" stroke-width="1.4"/>`;});
  const pins=inside.map(p=>`<g><circle cx="${f(p.x+3)}" cy="${f(p.y+3)}" r="14.5" fill="${INK}"/><circle cx="${f(p.x)}" cy="${f(p.y)}" r="13.5" fill="${ERAS[p.e][1]}" stroke="${INK}" stroke-width="3"/><text x="${f(p.x)}" y="${f(p.y+5)}" text-anchor="middle" font-family="Roboto Condensed" font-weight="900" font-size="14" fill="${INK}">${p.n}</text></g>`).join('');
  const placed=[];cv.font='700 14px "Roboto Condensed"';
  const chips=out.map(p=>{const km=Math.round(Math.hypot((p.lat-12.9716)*111,(p.lng-77.5946)*108));const dx=p.x-MW/2,dy=p.y-MH/2;
   const ar=Math.abs(dx)/MW>Math.abs(dy)/MH?(dx>0?'→':'←'):(dy>0?'↓':'↑');const t=`${p.name} · ${km} km ${ar}`;const w=cv.measureText(t).width+46,h=28;
   let x=Math.min(Math.max(p.x-w/2,12),MW-w-12),y=Math.min(Math.max(p.y-h/2,12),MH-h-40);
   for(let k=0;k<20;k++){if(!placed.some(o=>x<o.x+o.w&&o.x<x+w&&y<o.y+o.h+6&&o.y<y+h+6))break;y+=(p.y>MH/2?-1:1)*(h+8);}placed.push({x,y,w,h});
   return `<g><rect x="${f(x+2)}" y="${f(y+2)}" width="${f(w)}" height="${h}" rx="14" fill="${INK}"/><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${h}" rx="14" fill="${CREAM}" stroke="${INK}" stroke-width="2"/><circle cx="${f(x+14)}" cy="${f(y+14)}" r="10.5" fill="${ERAS[p.e][1]}" stroke="${INK}" stroke-width="2.2"/><text x="${f(x+14)}" y="${f(y+18.2)}" text-anchor="middle" font-family="Roboto Condensed" font-weight="900" font-size="12" fill="${INK}">${p.n}</text><text x="${f(x+31)}" y="${f(y+19)}" font-family="Roboto Condensed" font-weight="700" font-size="14" fill="${INK}">${esc(t)}</text></g>`;}).join('');
  const AREAS=[["CANTONMENT",77.6150,12.9815,-6],["CUBBON PARK",77.5925,12.9770,-8],["RICHMOND TOWN",77.6060,12.9585,4],["ULSOOR",77.6215,12.9895,-5],["SHIVAJINAGAR",77.6040,12.9900,-3],["MG ROAD",77.6120,12.9768,-4],["BRIGADE RD",77.6092,12.9668,-84],["JAYAMAHAL",77.5990,12.9985,3]];
  const areas=AREAS.map(([t,lng,lat,r])=>{const c=map.project([lng,lat]);return `<text x="${f(c.x)}" y="${f(c.y)}" transform="rotate(${r} ${f(c.x)} ${f(c.y)})" text-anchor="middle" dominant-baseline="central">${t}</text>`;}).join('');
  // ---------- tiles ----------
  const tiles=D.places.map((p,i)=>{const [x,y]=slots[i],c=ERAS[p.e][1];
   const nm=wrap(p.name,'700 13px "Roboto Condensed"',TW-12).slice(0,2), why=wrap(p.why,'500 11px "Roboto Condensed"',TW-12).slice(0,2);
   const ph=p.href?`<image x="6" y="6" width="${TW-12}" height="88" preserveAspectRatio="xMidYMid slice" xlink:href="${p.href}" clip-path="url(#phc)"/>`
     :`<rect x="6" y="6" width="${TW-12}" height="88" fill="${c}"/><g clip-path="url(#phc)"><path transform="translate(6 6)" d="${STR}" stroke="${INK}" stroke-width="2" fill="none"/></g><rect x="12" y="41" width="${TW-24}" height="18" fill="${CREAM}" stroke="${INK}" stroke-width="1.3"/><text x="${TW/2}" y="54" text-anchor="middle" font-family="Roboto Condensed" font-weight="700" font-size="10.5" letter-spacing=".6" fill="${INK}">PHOTO WANTED</text>`;
   return `<g id="Photo_${p.n}" transform="translate(${f(x)} ${f(y)})"><rect x="3.5" y="3.5" width="${TW}" height="${TH}" fill="#000"/><rect x="1" y="1" width="${TW-2}" height="${TH-2}" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>${ph}<rect x="6" y="6" width="${TW-12}" height="88" fill="none" stroke="${INK}" stroke-width="1.2"/><rect x="6" y="94" width="${TW-12}" height="4" fill="${c}"/>
<circle cx="17" cy="17" r="11.5" fill="${c}" stroke="${INK}" stroke-width="2.2"/><text x="17" y="21.3" text-anchor="middle" font-family="Roboto Condensed" font-weight="900" font-size="12.5" fill="${INK}">${p.n}</text>
<text y="113" font-family="Roboto Condensed" font-weight="700" font-size="13" fill="${INK}">${tspans(nm,6,13.5)}</text><text y="${113+nm.length*13.5+0.5}" font-family="Roboto Condensed" font-weight="500" font-size="11" fill="#3d3f52">${tspans(why,6,12.5)}</text></g>`;}).join('\n');
  // start card
  const start=`<g id="Start_here" transform="translate(${colX(0)} ${TOP})"><rect x="3.5" y="3.5" width="${TW}" height="${TH}" fill="#000"/><rect x="1" y="1" width="${TW-2}" height="${TH-2}" fill="${YEL}" stroke="${INK}" stroke-width="2"/>
<text x="10" y="40" font-family="Roboto Slab" font-weight="900" font-size="22" fill="${INK}"><tspan x="10">START</tspan><tspan x="10" dy="24">HERE</tspan></text><text x="${TW-12}" y="64" text-anchor="end" font-family="Roboto Condensed" font-weight="900" font-size="30" fill="${INK}">→</text>
<text y="100" font-family="Roboto Condensed" font-weight="500" font-size="11.5" fill="${INK}">${tspans(wrap('Photos run clockwise, 1 to 45, oldest to newest.','500 12px "Roboto Condensed"',TW-20),10,14)}</text></g>`;
  // ---------- title & intro ----------
  const introW=700, ix=W-M-introW;
  const l1=wrap(D.intro[0],'800 26px "Roboto Slab"',introW), l2=wrap(D.intro[1],'400 18px "Roboto Condensed"',introW);
  const title=`<g id="Title"><text x="${M+4}" y="62" font-family="Roboto Condensed" font-weight="700" font-size="17" letter-spacing="3" fill="${YEL}">BANGALORE'S ROCK MAP · 1930s TO TODAY</text>
<text x="${M}" y="152" font-family="Roboto Slab" font-weight="900" font-size="86" letter-spacing="-1" fill="${CREAM}">ROCKUMENTARY</text>
<text x="${M+4}" y="196" font-family="Roboto Condensed" font-weight="500" font-size="16" fill="${CREAM}" fill-opacity=".75">Ninety years of music, 45 places, one city.</text></g>
<g id="Intro" fill="${CREAM}"><text y="66" font-family="Roboto Slab" font-weight="800" font-size="26">${tspans(l1,ix,30)}</text><text y="${66+l1.length*30+10}" font-family="Roboto Condensed" font-weight="400" font-size="18">${tspans(l2,ix,24)}</text></g>`;
  // ---------- chapters (the key) ----------
  const cw=(MW-2*14)/3, chh=(CH-14-12)/2;
  const chap=D.CH.map(([t,body],i)=>{const cx=X0+(i%3)*(cw+14), cy=CY+14+Math.floor(i/3)*(chh+12);const c=ERAS[i][1];
    const bl=wrap(body,'400 14.5px "Roboto Condensed"',cw-34).slice(0,4);
    return `<g><rect x="${f(cx)}" y="${f(cy)}" width="${f(cw)}" height="${f(chh)}" fill="none"/><rect x="${f(cx)}" y="${f(cy)}" width="7" height="${f(chh)}" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
<text x="${f(cx+20)}" y="${f(cy+18)}" font-family="Roboto Condensed" font-weight="900" font-size="13" letter-spacing="1.6" fill="${INK}">${esc(ERAS[i][0].toUpperCase())} · PHOTOS ${D.RNG[i][0]}–${D.RNG[i][1]}</text>
<text x="${f(cx+20)}" y="${f(cy+44)}" font-family="Roboto Slab" font-weight="800" font-size="21" fill="${INK}">${esc(t)}</text>
<text y="${f(cy+66)}" font-family="Roboto Condensed" font-weight="400" font-size="14.5" fill="#2b2d3d">${tspans(bl,f(cx+20),17.5)}</text></g>`;}).join('');
  const chapters=`<g id="Decades_key"><rect x="${X0+5}" y="${CY+5}" width="${MW}" height="${CH}" fill="#000"/><rect x="${X0}" y="${CY}" width="${MW}" height="${CH}" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>${chap}</g>`;
  // ---------- assemble ----------
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="420mm" height="594mm" viewBox="0 0 ${W} ${H}">
<defs><clipPath id="mapclip"><rect width="${MW}" height="${MH}"/></clipPath><clipPath id="parkclip"><path d="${parkD}"/></clipPath><clipPath id="phc"><rect x="6" y="6" width="${TW-12}" height="88"/></clipPath></defs>
<rect id="Background" width="${W}" height="${H}" fill="${BG}"/>
${title}
<g id="Map"><rect x="${X0+5}" y="${Y0+5}" width="${MW}" height="${MH}" fill="#000"/><g transform="translate(${X0} ${Y0})"><g clip-path="url(#mapclip)">
<rect id="Land" width="${MW}" height="${MH}" fill="#1f2336"/>
<g id="Parks"><path d="${parkD}" fill="#2e6b4a"/><g clip-path="url(#parkclip)"><path d="${HATCH}" stroke="#5fb37a" stroke-width="1.6" fill="none"/></g></g>
<path id="Water" d="${polys('water')}" fill="#2f6fd1"/>
<path id="Rail" d="${lines('rail')}" fill="none" stroke="#8a8fa6" stroke-width="1.4" stroke-dasharray="3 2"/>
<g id="Roads" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${lines('rmc')}" stroke="${INK}" stroke-width="${rw(0.9)}"/><path d="${lines('rMc')}" stroke="${INK}" stroke-width="${rw(1.9)}"/><path d="${lines('rm')}" stroke="#b9b2a3" stroke-width="${rw(0.5)}"/><path d="${lines('rM')}" stroke="#efe6d0" stroke-width="${rw(1.3)}"/></g>
<g id="Area_names" font-family="Roboto Condensed" font-weight="700" font-size="21" letter-spacing="3" fill="${CREAM}" fill-opacity=".8" stroke="${INK}" stroke-width="4" paint-order="stroke">${areas}</g>
<g id="Leader_lines">${leaders}</g><g id="Pins">${pins}</g><g id="Off_map_places">${chips}</g>
<g id="Map_credit"><rect x="${MW-330}" y="${MH-30}" width="318" height="20" rx="10" fill="${INK}" fill-opacity=".85"/><text x="${MW-171}" y="${MH-16}" text-anchor="middle" font-family="Roboto Condensed" font-weight="500" font-size="12" fill="${CREAM}">Map data © OpenStreetMap contributors · OpenFreeMap</text></g>
</g><rect width="${MW}" height="${MH}" fill="none" stroke="${INK}" stroke-width="4"/></g></g>
${chapters}
<g id="Photos">${start}
${tiles}</g>
</svg>`;},D);
 fs.writeFileSync(R+'merch/'+OUTN+'.svg',svg);console.log('svg MB',(svg.length/1e6).toFixed(1));
 const q=await b.newPage({viewport:{width:1587,height:2245}});
 await q.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;700;900&family=Roboto+Slab:wght@800;900&display=swap" rel="stylesheet"><style>@page{size:420mm 594mm;margin:0}body{margin:0}svg{display:block;width:1587px;height:2245px}@media print{svg{width:420mm;height:594mm}}</style></head><body>${svg.replace(/^<\?xml[^>]*>/,'')}</body></html>`);
 await q.evaluate(()=>document.fonts.ready);await q.waitForTimeout(1500);q.setDefaultTimeout(400000);
 await q.screenshot({path:R+'merch/'+OUTN+'-preview.png'});
 await q.pdf({path:R+'merch/'+OUTN+'.pdf',width:'420mm',height:'594mm',printBackground:true});
 console.log('pdf MB',(fs.statSync(R+'merch/'+OUTN+'.pdf').size/1e6).toFixed(1));await b.close();
})();
