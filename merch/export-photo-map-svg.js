const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'), path=require('path');
const SP='/tmp/claude-0/-home-user-DASHBOARD-CASE-STUDIES/573ba59d-e5f2-5406-845c-e9df8bbc9145/scratchpad', M='/home/user/rockumentary-bangalore/merch/';
(async () => {
  const b = await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--ignore-gpu-blocklist']});
  const p = await b.newPage({ viewport:{ width:1587, height:2245 } });
  await p.route('https://unpkg.com/**', r => r.fulfill({ path:SP+'/ml/package/dist/'+r.request().url().split('/dist/')[1] }));
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://'+M+'photo-map-poster.html');
  await p.waitForSelector('body[data-ready]', { timeout:180000 });
  const data = await p.evaluate(() => {
    const OX=186, OY=216, f=n=>Math.round(n*10)/10;
    const pr=c=>{const q=map.project(c);return f(q.x)+','+f(q.y);};
    const lineD=g=>{const L=g.type==='LineString'?[g.coordinates]:g.type==='MultiLineString'?g.coordinates:[];return L.map(l=>'M'+l.map(pr).join('L')).join('');};
    const polyD=g=>{const P=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];return P.map(r=>r.map(l=>'M'+l.map(pr).join('L')+'Z').join('')).join('');};
    const q=id=>map.queryRenderedFeatures({layers:[id]});
    const z=map.getZoom(), rw=k=>{const t=(Math.pow(1.5,z-14)-1)/(Math.pow(1.5,3)-1);return f(3*k+9*k*t);};
    const polys=id=>q(id).map(x=>polyD(x.geometry)).filter(Boolean);
    const lines=id=>q(id).map(x=>lineD(x.geometry)).join('');
    // caption line breaks as rendered
    const caps=[...document.querySelectorAll('.tile .t')].map(t=>{const words=t.textContent.split(' ');const r=document.createRange();const out=[];let cur='',top=null;
      const tn=t.firstChild;let i=0;words.forEach(w=>{r.setStart(tn,i);r.setEnd(tn,i+w.length);const y=r.getClientRects()[0]?.top;if(top===null)top=y;if(y>top+3){out.push(cur.trim());cur='';top=y;}cur+=w+' ';i+=w.length+1;});out.push(cur.trim());return out.slice(0,2);});
    const tiles=[...document.querySelectorAll('.tile')].map(el=>({x:parseFloat(el.style.left),y:parseFloat(el.style.top),r:parseFloat(el.style.getPropertyValue('--r'))}));
    const areas=[...document.querySelectorAll('.area')].map(a=>({t:a.textContent,x:parseFloat(a.style.left),y:parseFloat(a.style.top),r:parseFloat(a.style.getPropertyValue('--r')),s:a.classList.contains('s')}));
    return {OX,OY,park:polys('park'),green:polys('green'),water:polys('water'),rail:lines('rail'),rmc:lines('rmc'),rMc:lines('rMc'),rm:lines('rm'),rM:lines('rM'),
      w:{rmc:rw(0.9),rMc:rw(1.9),rm:rw(0.5),rM:rw(1.3)},caps,tiles,areas,ERAS,PTS:PTS.map(({name,e,n,img})=>({name,e,n,img})),inside:EXP.inside.map(({x,y,ox,oy,n,e})=>({x,y,ox,oy,n,e})),out:EXP.out.map(({ex,ey,ew,eh,etxt,n,e})=>({ex,ey,ew,eh,etxt,n,e})),lines:EXP.lines};
  });
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const {OX,OY,ERAS}=data, INK='#0b0c10', CREAM='#f3e9d2';
  let HATCH='';for(let c=-1633;c<1215+20;c+=12)HATCH+=`M${c.toFixed(1)} 1633L${(c+1633).toFixed(1)} 0`;
  let STRIPES='';for(let c=-118;c<133+10;c+=11.3)STRIPES+=`M${c.toFixed(1)} 118L${(c+118).toFixed(1)} 0`;
  const img=src=>{const f=path.resolve(M,src);return 'data:image/jpeg;base64,'+fs.readFileSync(f).toString('base64');};
  let o=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="420mm" height="594mm" viewBox="0 0 1587 2245">
<defs>
<clipPath id="parkclip"><path d="${data.park.concat(data.green).join('')}"/></clipPath>
<clipPath id="mapclip"><rect x="0" y="0" width="1215" height="1633"/></clipPath>
<clipPath id="ph"><rect width="133" height="118"/></clipPath>
</defs>
<rect id="Background" width="1587" height="2245" fill="#14162a"/>
<g id="Map">
<rect x="${181+6}" y="${211+6}" width="1225" height="1643" fill="#000"/>
<rect x="181" y="211" width="1225" height="1643" fill="${INK}"/>
<g transform="translate(${OX} ${OY})" clip-path="url(#mapclip)">
<rect id="Land" width="1215" height="1633" fill="#1f2336"/>
<g id="Parks"><path id="Park_fill" d="${data.park.concat(data.green).join('')}" fill="#2e6b4a" fill-rule="nonzero"/><g id="Park_hatching" clip-path="url(#parkclip)"><path d="${HATCH}" stroke="#5fb37a" stroke-width="1.6" fill="none"/></g></g>
<g id="Water" fill="#2f6fd1">${data.water.map(d=>`<path d="${d}" fill-rule="evenodd"/>`).join('')}</g>
<path id="Rail" d="${data.rail}" fill="none" stroke="#8a8fa6" stroke-width="1.4" stroke-dasharray="3 2"/>
<g id="Roads" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path id="Minor_road_casing" d="${data.rmc}" stroke="${INK}" stroke-width="${data.w.rmc}"/>
<path id="Major_road_casing" d="${data.rMc}" stroke="${INK}" stroke-width="${data.w.rMc}"/>
<path id="Minor_roads" d="${data.rm}" stroke="#b9b2a3" stroke-width="${data.w.rm}"/>
<path id="Major_roads" d="${data.rM}" stroke="#efe6d0" stroke-width="${data.w.rM}"/>
</g>
<g id="Area_names" font-family="Permanent Marker" fill="${CREAM}" text-anchor="middle" dominant-baseline="central">${data.areas.map(a=>`<text x="${a.x}" y="${a.y}" font-size="${a.s?21:28}" opacity="${a.s?.7:.85}" letter-spacing="${a.s?1.3:1.7}" transform="rotate(${a.r} ${a.x} ${a.y})">${esc(a.t)}</text>`).join('')}</g>
<g id="Leader_lines">${data.lines}</g>
<g id="Pins" font-family="Roboto Condensed" font-weight="900" font-size="14" text-anchor="middle">${data.inside.map(q=>`<g><circle cx="${q.x+3}" cy="${q.y+3}" r="15" fill="${INK}"/><circle cx="${q.x}" cy="${q.y}" r="13.5" fill="${ERAS[q.e][1]}" stroke="${INK}" stroke-width="3"/><text x="${q.x}" y="${q.y+5}" fill="${INK}">${q.n}</text></g>`).join('')}</g>
<g id="Off_map_places" font-family="Roboto Condensed" font-weight="700" font-size="14">${data.out.map(q=>`<g><rect x="${q.ex+2}" y="${q.ey+2}" width="${q.ew}" height="${q.eh}" rx="${q.eh/2}" fill="${INK}"/><rect x="${q.ex+1}" y="${q.ey+1}" width="${q.ew-2}" height="${q.eh-2}" rx="${q.eh/2}" fill="${CREAM}" stroke="${INK}" stroke-width="2"/><circle cx="${q.ex+3+12}" cy="${q.ey+q.eh/2}" r="11" fill="${ERAS[q.e][1]}" stroke="${INK}" stroke-width="2.5"/><text x="${q.ex+15}" y="${q.ey+q.eh/2+4.5}" font-size="12" font-weight="900" text-anchor="middle">${q.n}</text><text x="${q.ex+35}" y="${q.ey+q.eh/2+5}" fill="${INK}">${esc(q.etxt)}</text></g>`).join('')}</g>
<text id="Map_credit" x="1207" y="1625" text-anchor="end" font-family="Roboto Condensed" font-size="11" fill="${CREAM}" fill-opacity=".6">Map data © OpenStreetMap contributors · OpenFreeMap</text>
</g></g>
<g id="Photos">${data.PTS.map((q,i)=>{const t=data.tiles[i],c=ERAS[q.e][1],cap=data.caps[i];
  const ph=q.img?`<image width="133" height="118" preserveAspectRatio="xMidYMid slice" xlink:href="${img(q.img)}" clip-path="url(#ph)"/>`:`<rect width="133" height="118" fill="${c}"/><g clip-path="url(#ph)"><path d="${STRIPES}" stroke="${INK}" stroke-width="2" fill="none"/></g><g transform="rotate(-4 66 59)"><rect x="18" y="46" width="97" height="26" fill="${CREAM}" stroke="${INK}" stroke-width="1.5"/><text x="66.5" y="64" text-anchor="middle" font-family="Permanent Marker" font-size="15" fill="${INK}">photo wanted</text></g>`;
  return `<g id="Photo_${q.n}" transform="rotate(${t.r} ${t.x+72.5} ${t.y+87.5})"><rect x="${t.x+4}" y="${t.y+4}" width="145" height="175" fill="#000"/><rect x="${t.x+1.25}" y="${t.y+1.25}" width="142.5" height="172.5" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/><g transform="translate(${t.x+6} ${t.y+6})">${ph}<rect width="133" height="118" fill="none" stroke="${INK}" stroke-width="1.5"/></g><circle cx="${t.x+17}" cy="${t.y+141}" r="10" fill="${c}" stroke="${INK}" stroke-width="2"/><text x="${t.x+17}" y="${t.y+145}" text-anchor="middle" font-family="Roboto Condensed" font-weight="900" font-size="12" fill="${INK}">${q.n}</text><text x="${t.x+33}" y="${t.y+141}" font-family="Roboto Condensed" font-weight="700" font-size="13" fill="${INK}">${cap.map((l,k)=>`<tspan x="${t.x+33}" dy="${k?14.3:0}">${esc(l)}</tspan>`).join('')}</text></g>`;}).join('')}</g>
<g id="Title" fill="${CREAM}">
<text x="28" y="76" font-family="Permanent Marker" font-size="54">Rockumentary</text>
<text x="28" y="104" font-family="Roboto Condensed" font-weight="700" font-size="14" letter-spacing="2.2" fill="#FFD54A">BANGALORE'S ROCK MAP · 1930S TO TODAY</text>
<g id="Decade_key" font-family="Roboto Condensed" font-weight="700" font-size="16">${ERAS.map((e,i)=>{const x=28+(i%3)*[0,105,200][i%3]/(i%3||1)*(i%3?1:0),xx=28+[0,104,198][i%3],y=134+Math.floor(i/3)*27;return `<circle cx="${xx+9}" cy="${y-5}" r="8" fill="${e[1]}" stroke="${INK}" stroke-width="2.5"/><text x="${xx+25}" y="${y}">${esc(e[0])}</text>`;}).join('')}</g>
</g>
</svg>`;
  fs.writeFileSync(M+'rockumentary-photo-map.svg', o); console.log('svg MB', (o.length/1e6).toFixed(1));
  const q = await b.newPage({ viewport:{ width:1587, height:2245 } });
  await q.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;900&family=Permanent+Marker&display=swap" rel="stylesheet"><style>@page{size:420mm 594mm;margin:0}body{margin:0}</style></head><body>${o.replace(/^<\?xml[^>]*>/,'').replace('width="420mm" height="594mm"','width="1587" height="2245" style="display:block;width:420mm;height:594mm"')}</body></html>`);
  await q.evaluate(()=>document.fonts.ready); await q.waitForTimeout(1500);
  q.setDefaultTimeout(400000); await q.screenshot({ path:SP+'/svg-check.png', timeout:400000 });
  await q.pdf({ path:M+'rockumentary-photo-map-vector.pdf', width:'420mm', height:'594mm', printBackground:true });
  console.log('pdf MB', (fs.statSync(M+'rockumentary-photo-map-vector.pdf').size/1e6).toFixed(1));
  await b.close();
})();
