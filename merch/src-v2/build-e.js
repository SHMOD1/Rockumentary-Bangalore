const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const SP='/tmp/claude-0/-home-user-DASHBOARD-CASE-STUDIES/573ba59d-e5f2-5406-845c-e9df8bbc9145/scratchpad', R='/home/user/rockumentary-bangalore/', OUTN=process.argv[2]||'rockumentary-poster-v4';
const PALS={
 night:{land:'#1f2336',park:'#2e6b4a',hatch:'#5fb37a',water:'#2f6fd1',rail:'#8a8fa6',casing:'#0b0c10',minor:'#b9b2a3',major:'#efe6d0',label:'#f3e9d2',lstroke:'#0b0c10'},
 mono:{land:'#1b1c23',park:'#262b29',hatch:'#353c37',water:'#25334a',rail:'#55576a',casing:'#0b0c10',minor:'#44465a',major:'#8d8fa0',label:'#a7a9b8',lstroke:'#0b0c10'},
 paper:{land:'#ece2cb',park:'#c3cf9f',hatch:'#a5b47f',water:'#9cbbcc',rail:'#9a8c78',casing:'#8a7660',minor:'#fbf6ea',major:'#ffffff',label:'#6b5a45',lstroke:'#ece2cb'},
 sage:{land:'#c8cda4',park:'#a2b276',hatch:'#87985c',water:'#94b4b6',rail:'#6f6a52',casing:'#6f6a52',minor:'#eeead8',major:'#fbf8ee',label:'#4f4c3a',lstroke:'#c8cda4'}};
PALS.retro={land:'#231b17',park:'#3f4a26',hatch:'#5f6d34',water:'#2f6b6e',rail:'#7a6a58',casing:'#120d0b',minor:'#6d5e4f',major:'#ecd9b4',label:'#f1e2c2',lstroke:'#120d0b',ui:{INK:'#140f0d',CREAM:'#f1e2c2',BG:'#1c1512',YEL:'#E9B03B'},eras:['#E9B03B','#E0742F','#C73A35','#9B5A9E','#2F9E94','#5B8FC7']};
PALS.punk={land:'#151515',park:'#1f2a1d',hatch:'#2f4a2b',water:'#1b2f52',rail:'#555555',casing:'#000000',minor:'#3b3b3b',major:'#ebe5d8',label:'#ebe5d8',lstroke:'#000000',ui:{INK:'#000000',CREAM:'#f2ede2',BG:'#0d0d0d',YEL:'#FFE000'},eras:['#FFE000','#FF7A00','#FF2E4D','#B04DFF','#1EA7FF','#19E3A6']};
const PALN=process.argv[3]||'night';
const D=JSON.parse(fs.readFileSync(SP+'/v2/data.json','utf8'));
D.places.forEach(p=>{p.href=p.img?'data:image/jpeg;base64,'+fs.readFileSync(R+p.img).toString('base64'):'';});
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1300,height:1360}});
 await p.route('https://unpkg.com/**',r=>r.fulfill({path:SP+'/ml/package/dist/'+r.request().url().split('/dist/')[1]}));
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+SP+'/v2/map.html'); await p.waitForSelector('body[data-ready]',{timeout:180000});
 await p.evaluate(()=>Promise.all(['400 14px "Roboto Condensed"','500 14px "Roboto Condensed"','700 14px "Roboto Condensed"','900 14px "Roboto Condensed"','800 14px "Roboto Slab"','900 14px "Roboto Slab"'].map(f=>document.fonts.load(f))));
 const svg=await p.evaluate(({D,PAL})=>{
  const W=1587,H=2245,M=22,U=PAL.ui||{},INK=U.INK||'#0b0c10',CREAM=U.CREAM||'#f3e9d2',BG=U.BG||'#23263a',YEL=U.YEL||'#FFD54A',ERAS=PAL.eras?D.ERAS.map((e,i)=>[e[0],PAL.eras[i]]):D.ERAS;
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
  const vinyl=(x,y,c,n,r)=>`<g><circle cx="${f(x+2.5)}" cy="${f(y+2.5)}" r="${r}" fill="#000" fill-opacity=".6"/><circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${INK}" stroke="${CREAM}" stroke-width="1.2"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r*.8)}" fill="none" stroke="#3a3d4f" stroke-width=".8"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r*.68)}" fill="none" stroke="#3a3d4f" stroke-width=".8"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r*.56)}" fill="${c}"/><text x="${f(x)}" y="${f(y+r*.26)}" text-anchor="middle" font-family="Roboto Condensed" font-weight="900" font-size="${f(r*.74)}" fill="${INK}">${n}</text></g>`;
  const pins=inside.map(p=>vinyl(p.x,p.y,ERAS[p.e][1],p.n,15.5)).join('');
  const placed=[];cv.font='700 14px "Roboto Condensed"';
  const chips=out.map(p=>{const km=Math.round(Math.hypot((p.lat-12.9716)*111,(p.lng-77.5946)*108));const dx=p.x-MW/2,dy=p.y-MH/2;
   const ar=Math.abs(dx)/MW>Math.abs(dy)/MH?(dx>0?'→':'←'):(dy>0?'↓':'↑');const t=`${p.name} · ${km} km ${ar}`;const w=cv.measureText(t).width+46,h=28;
   let x=Math.min(Math.max(p.x-w/2,12),MW-w-12),y=Math.min(Math.max(p.y-h/2,12),MH-h-40);
   for(let k=0;k<20;k++){if(!placed.some(o=>x<o.x+o.w&&o.x<x+w&&y<o.y+o.h+6&&o.y<y+h+6))break;y+=(p.y>MH/2?-1:1)*(h+8);}placed.push({x,y,w,h});
   const sw=30;return `<g><rect x="${f(x+3)}" y="${f(y+3)}" width="${f(w)}" height="${h}" fill="#000" fill-opacity=".7"/><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${h}" fill="${CREAM}" stroke="${INK}" stroke-width="2"/><rect x="${f(x)}" y="${f(y)}" width="${sw}" height="${h}" fill="${ERAS[p.e][1]}" stroke="${INK}" stroke-width="2"/><line x1="${f(x+sw)}" y1="${f(y+3)}" x2="${f(x+sw)}" y2="${f(y+h-3)}" stroke="${INK}" stroke-width="1.6" stroke-dasharray="2.5 2.5"/><circle cx="${f(x+sw)}" cy="${f(y)}" r="5" fill="${PAL.land}" stroke="${INK}" stroke-width="1.6"/><circle cx="${f(x+sw)}" cy="${f(y+h)}" r="5" fill="${PAL.land}" stroke="${INK}" stroke-width="1.6"/><text x="${f(x+sw/2)}" y="${f(y+18.5)}" text-anchor="middle" font-family="Roboto Slab" font-weight="900" font-size="13" fill="${INK}">${p.n}</text><text x="${f(x+sw+9)}" y="${f(y+19)}" font-family="Roboto Condensed" font-weight="700" font-size="14" fill="${INK}">${esc(t)}</text></g>`;}).join('');
  const AREAS=[["CANTONMENT",77.6150,12.9815,-6],["CUBBON PARK",77.5925,12.9770,-8],["RICHMOND TOWN",77.6060,12.9585,4],["ULSOOR",77.6215,12.9895,-5],["SHIVAJINAGAR",77.6040,12.9900,-3],["MG ROAD",77.6120,12.9768,-4],["BRIGADE RD",77.6092,12.9668,-84],["JAYAMAHAL",77.5990,12.9985,3]];
  const areas=AREAS.map(([t,lng,lat,r])=>{const c=map.project([lng,lat]);return `<text x="${f(c.x)}" y="${f(c.y)}" transform="rotate(${r} ${f(c.x)} ${f(c.y)})" text-anchor="middle" dominant-baseline="central">${t}</text>`;}).join('');
  // ---------- tiles ----------
  const tiles=D.places.map((p,i)=>{const [x,y]=slots[i],c=ERAS[p.e][1];
   const nm=wrap(p.name,'700 13px "Roboto Condensed"',TW-14).slice(0,2), why=wrap(p.why,'500 11px "Roboto Condensed"',TW-14).slice(0,2);
   const bh=9+nm.length*13.5+why.length*12.2+5, by=TH-bh;
   const ph=p.href?`<image width="${TW}" height="${f(by)}" preserveAspectRatio="xMidYMid slice" xlink:href="${p.href}"/>`
     :`<rect width="${TW}" height="${f(by)}" fill="${c}"/><path d="${STR}" stroke="${INK}" stroke-width="2" fill="none" transform="scale(1.25)"/><rect x="12" y="${f(by/2-10)}" width="${TW-24}" height="20" fill="${CREAM}" stroke="${INK}" stroke-width="1.3"/><text x="${TW/2}" y="${f(by/2+4)}" text-anchor="middle" font-family="Roboto Condensed" font-weight="700" font-size="10.5" letter-spacing=".6" fill="${INK}">PHOTO WANTED</text>`;
   return `<g id="Photo_${p.n}" transform="translate(${f(x)} ${f(y)})"><rect x="4" y="4" width="${TW}" height="${TH}" fill="#000"/><g clip-path="url(#tilec)">${ph}<rect y="${f(by)}" width="${TW}" height="${f(bh)}" fill="${c}"/><line x1="0" y1="${f(by)}" x2="${TW}" y2="${f(by)}" stroke="${INK}" stroke-width="2.5"/></g><rect x="1.25" y="1.25" width="${TW-2.5}" height="${TH-2.5}" fill="none" stroke="${INK}" stroke-width="2.5"/>
<circle cx="18" cy="18" r="13" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/><text x="18" y="22.6" text-anchor="middle" font-family="Roboto Slab" font-weight="900" font-size="13" fill="${INK}">${p.n}</text>
<text y="${f(by+19)}" font-family="Roboto Condensed" font-weight="700" font-size="13" fill="${INK}">${tspans(nm,7,13.5)}</text><text y="${f(by+19+nm.length*13.5)}" font-family="Roboto Condensed" font-weight="500" font-size="11" fill="${INK}">${tspans(why,7,12.2)}</text></g>`;}).join('\n');
  // start card: an admit-one ticket
  const start=`<g id="Start_here" transform="translate(${colX(0)} ${TOP})"><rect x="4" y="4" width="${TW}" height="${TH}" fill="#000"/><rect x="1.25" y="1.25" width="${TW-2.5}" height="${TH-2.5}" fill="${YEL}" stroke="${INK}" stroke-width="2.5"/>
<rect x="1.25" y="1.25" width="${TW-2.5}" height="36" fill="${INK}"/><text x="${TW/2}" y="25" text-anchor="middle" font-family="Roboto Condensed" font-weight="900" font-size="14" letter-spacing="2.4" fill="${YEL}">ADMIT ONE</text>
<line x1="8" y1="44" x2="${TW-8}" y2="44" stroke="${INK}" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="0" cy="44" r="6" fill="${BG}" stroke="${INK}" stroke-width="2"/><circle cx="${TW}" cy="44" r="6" fill="${BG}" stroke="${INK}" stroke-width="2"/>
<text x="10" y="74" font-family="Roboto Slab" font-weight="900" font-size="21" fill="${INK}"><tspan x="10">START</tspan><tspan x="10" dy="22">HERE →</tspan></text>
<text y="124" font-family="Roboto Condensed" font-weight="500" font-size="11.5" fill="${INK}">${tspans(wrap('Photos run clockwise, 1 to 45, oldest to newest.','500 11.5px "Roboto Condensed"',TW-20),10,13)}</text></g>`;
  // ---------- title & intro ----------
  const introW=W-M-930, ix=W-M-introW;
  const l1=wrap(D.intro[0],'800 26px "Roboto Slab"',introW), l2=wrap(D.intro[1],'400 18px "Roboto Condensed"',introW);
  const RX=822,RY=118,RR=104;let grooves='';for(let r=44;r<RR-4;r+=5)grooves+=`<circle cx="${RX}" cy="${RY}" r="${r}" fill="none" stroke="#2c2f40" stroke-width="1"/>`;
  const record=`<g id="Record"><circle cx="${RX+5}" cy="${RY+5}" r="${RR}" fill="#000" fill-opacity=".5"/><circle cx="${RX}" cy="${RY}" r="${RR}" fill="${INK}" stroke="#3a3d4f" stroke-width="1.5"/>${grooves}<path d="M${RX} ${RY}L${RX+RR*Math.cos(-1.1)} ${RY+RR*Math.sin(-1.1)}A${RR} ${RR} 0 0 1 ${RX+RR*Math.cos(-0.55)} ${RY+RR*Math.sin(-0.55)}Z" fill="#ffffff" fill-opacity=".07"/>
<circle cx="${RX}" cy="${RY}" r="40" fill="${YEL}" stroke="${INK}" stroke-width="2"/><text x="${RX}" y="${RY-14}" text-anchor="middle" font-family="Roboto Condensed" font-weight="900" font-size="10" letter-spacing="1.2" fill="${INK}">SIDE A</text><text x="${RX}" y="${RY-4}" text-anchor="middle" font-family="Roboto Condensed" font-weight="700" font-size="7.5" letter-spacing=".6" fill="${INK}">1930s – TODAY</text><text x="${RX}" y="${RY+19}" text-anchor="middle" font-family="Roboto Slab" font-weight="900" font-size="12" fill="${INK}">45 RPM</text><text x="${RX}" y="${RY+29}" text-anchor="middle" font-family="Roboto Condensed" font-weight="700" font-size="7.5" letter-spacing=".8" fill="${INK}">90 YEARS</text><circle cx="${RX}" cy="${RY}" r="4" fill="${BG}"/></g>`;
  const title=record+`<g id="Title"><text x="${M+4}" y="62" font-family="Roboto Condensed" font-weight="700" font-size="17" letter-spacing="3" fill="${YEL}">BANGALORE'S ROCK MAP · 1930s TO TODAY</text>
<text x="${M}" y="152" font-family="Roboto Slab" font-weight="900" font-size="86" letter-spacing="-1" fill="${CREAM}">ROCKUMENTARY</text>
<text x="${M+4}" y="196" font-family="Roboto Condensed" font-weight="500" font-size="16" fill="${CREAM}" fill-opacity=".75">Ninety years of music, 45 places, one city.</text></g>
<g id="Intro" fill="${CREAM}"><text y="66" font-family="Roboto Slab" font-weight="800" font-size="26">${tspans(l1,ix,30)}</text><text y="${66+l1.length*30+10}" font-family="Roboto Condensed" font-weight="400" font-size="18">${tspans(l2,ix,24)}</text></g>`;
  // ---------- chapters as gig tickets (the key) ----------
  const cw=(MW-2*16)/3, chh=(CH-14)/2, SW=62;
  const chap=D.CH.map(([t,body],i)=>{const cx=X0+(i%3)*(cw+16), cy=CY+Math.floor(i/3)*(chh+14);const c=ERAS[i][1];
    const bl=wrap(body,'400 14px "Roboto Condensed"',cw-SW-30).slice(0,4);
    return `<g id="Ticket_${i+1}"><rect x="${f(cx+5)}" y="${f(cy+5)}" width="${f(cw)}" height="${f(chh)}" fill="#000"/><rect x="${f(cx)}" y="${f(cy)}" width="${f(cw)}" height="${f(chh)}" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>
<rect x="${f(cx)}" y="${f(cy)}" width="${SW}" height="${f(chh)}" fill="${c}" stroke="${INK}" stroke-width="2.5"/><line x1="${f(cx+SW)}" y1="${f(cy+8)}" x2="${f(cx+SW)}" y2="${f(cy+chh-8)}" stroke="${INK}" stroke-width="2" stroke-dasharray="4 4"/>
<circle cx="${f(cx+SW)}" cy="${f(cy)}" r="8" fill="${BG}" stroke="${INK}" stroke-width="2.5"/><circle cx="${f(cx+SW)}" cy="${f(cy+chh)}" r="8" fill="${BG}" stroke="${INK}" stroke-width="2.5"/>
<text transform="translate(${f(cx+SW/2+6)} ${f(cy+chh/2)}) rotate(-90)" text-anchor="middle" font-family="Roboto Condensed" font-weight="900" font-size="15" letter-spacing="2.4" fill="${INK}">ADMIT ONE</text>
<text x="${f(cx+SW+16)}" y="${f(cy+24)}" font-family="Roboto Condensed" font-weight="900" font-size="13" letter-spacing="1.6" fill="${INK}">${esc(ERAS[i][0].toUpperCase())} · PHOTOS ${D.RNG[i][0]}–${D.RNG[i][1]}</text>
<text x="${f(cx+SW+16)}" y="${f(cy+50)}" font-family="Roboto Slab" font-weight="800" font-size="21" fill="${INK}">${esc(t)}</text>
<text y="${f(cy+72)}" font-family="Roboto Condensed" font-weight="400" font-size="14" fill="#2b2d3d">${tspans(bl,f(cx+SW+16),17)}</text>
<text x="${f(cx+cw-12)}" y="${f(cy+chh-10)}" text-anchor="end" font-family="Roboto Condensed" font-weight="700" font-size="10" letter-spacing="1.5" fill="#6b6d80">ROCKUMENTARY · BANGALORE</text></g>`;}).join('');
  const chapters=`<g id="Decade_tickets">${chap}</g>`;
  // ---------- assemble ----------
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="420mm" height="594mm" viewBox="0 0 ${W} ${H}">
<defs><clipPath id="mapclip"><rect width="${MW}" height="${MH}"/></clipPath><clipPath id="parkclip"><path d="${parkD}"/></clipPath><clipPath id="tilec"><rect width="${TW}" height="${TH}"/></clipPath><clipPath id="phc"><rect x="6" y="6" width="${TW-12}" height="88"/></clipPath></defs>
<rect id="Background" width="${W}" height="${H}" fill="${BG}"/>
${title}
<g id="Map"><rect x="${X0+5}" y="${Y0+5}" width="${MW}" height="${MH}" fill="#000"/><g transform="translate(${X0} ${Y0})"><g clip-path="url(#mapclip)">
<rect id="Land" width="${MW}" height="${MH}" fill="${PAL.land}"/>
<g id="Parks"><path d="${parkD}" fill="${PAL.park}"/><g clip-path="url(#parkclip)"><path d="${HATCH}" stroke="${PAL.hatch}" stroke-width="1.6" fill="none"/></g></g>
<path id="Water" d="${polys('water')}" fill="${PAL.water}"/>
<path id="Rail" d="${lines('rail')}" fill="none" stroke="${PAL.rail}" stroke-width="1.4" stroke-dasharray="3 2"/>
<g id="Roads" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${lines('rmc')}" stroke="${PAL.casing}" stroke-width="${rw(0.9)}"/><path d="${lines('rMc')}" stroke="${PAL.casing}" stroke-width="${rw(1.9)}"/><path d="${lines('rm')}" stroke="${PAL.minor}" stroke-width="${rw(0.5)}"/><path d="${lines('rM')}" stroke="${PAL.major}" stroke-width="${rw(1.3)}"/></g>
<g id="Area_names" font-family="Roboto Condensed" font-weight="700" font-size="21" letter-spacing="3" fill="${PAL.label}" fill-opacity=".85" stroke="${PAL.lstroke}" stroke-width="4" paint-order="stroke">${areas}</g>
<g id="Leader_lines">${leaders}</g><g id="Pins">${pins}</g><g id="Off_map_places">${chips}</g>
<g id="Map_credit"><rect x="${MW-330}" y="${MH-30}" width="318" height="20" rx="10" fill="${INK}" fill-opacity=".85"/><text x="${MW-171}" y="${MH-16}" text-anchor="middle" font-family="Roboto Condensed" font-weight="500" font-size="12" fill="${CREAM}">Map data © OpenStreetMap contributors · OpenFreeMap</text></g>
</g><rect width="${MW}" height="${MH}" fill="none" stroke="${INK}" stroke-width="4"/></g></g>
${chapters}
<g id="Photos">${start}
${tiles}</g>
</svg>`;},{D,PAL:PALS[PALN]});
 const OUT=OUTN+(PALN==='night'?'':'-'+PALN);fs.writeFileSync(R+'merch/'+OUT+'.svg',svg);console.log('svg MB',(svg.length/1e6).toFixed(1));
 const q=await b.newPage({viewport:{width:1587,height:2245}});
 await q.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;700;900&family=Roboto+Slab:wght@800;900&display=swap" rel="stylesheet"><style>@page{size:420mm 594mm;margin:0}body{margin:0}svg{display:block;width:1587px;height:2245px}@media print{svg{width:420mm;height:594mm}}</style></head><body>${svg.replace(/^<\?xml[^>]*>/,'')}</body></html>`);
 await q.evaluate(()=>document.fonts.ready);await q.waitForTimeout(1500);q.setDefaultTimeout(400000);
 await q.screenshot({path:R+'merch/'+OUT+'-preview.png'});
 await q.pdf({path:R+'merch/'+OUT+'.pdf',width:'420mm',height:'594mm',printBackground:true});
 console.log('pdf MB',(fs.statSync(R+'merch/'+OUT+'.pdf').size/1e6).toFixed(1));await b.close();
})();
