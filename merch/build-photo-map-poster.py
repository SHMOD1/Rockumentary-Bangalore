import json
SP='/tmp/claude-0/-home-user-DASHBOARD-CASE-STUDIES/573ba59d-e5f2-5406-845c-e9df8bbc9145/scratchpad'
OUT='/home/user/rockumentary-bangalore/merch/photo-map-poster.html'
P=json.load(open(SP+'/places.json'))['places']
ERAS=[('1930s–50s','#FFD54A'),('1960s','#FF9F43'),('1970s','#FF5C8A'),('1980s','#C07CFF'),('1990s','#4FA8FF'),('2000s–today','#3EE6C8')]
def era(p):
    k=p['key']; l=p['layer']
    if l=='dance': return 0
    if l=='schools': return 1
    if l in('hangouts','cabaret'): return 3 if k in('hangouts-8','hangouts-9') else 2
    v={'venues-3':3,'venues-4':3,'venues-10':3,'venues-11':3,'venues-12':3,'venues-14':3,'venues-1':4,'venues-5':4,'venues-9':4}
    return v.get(k,5)
# Ramada = later Stay Longer; keep one pin
MED=json.load(open(SP+'/place-media.json'))
PICK={'hangouts-1':1}
pts=[dict(name=p['name'],lat=p['lat'],lng=p['lng'],e=era(p),img=('../'+MED[p['key']][PICK.get(p['key'],0)]) if MED.get(p['key']) else '') for p in P if p['key']!='hangouts-11']
pts.sort(key=lambda q:(q['e'],q['lat']<12.97,q['name']))
for i,q in enumerate(pts): q['n']=i+1
for q in pts:
    if q['name']=='Hotel Stay Longer': q['name']='Hotel Stay Longer / Ramada'
STYLE=r'''const INK="#0b0c10",LAND="#1f2336",ROAD="#efe6d0",WATER="#2f6fd1",PARK="#2e6b4a";
function roadW(k){return["interpolate",["exponential",1.5],["zoom"],10,0.6*k,14,3*k,17,12*k];}
const ST={version:8,sources:{omt:{type:"vector",url:"https://tiles.openfreemap.org/planet"}},layers:[
{id:"bg",type:"background",paint:{"background-color":LAND}},
{id:"park",type:"fill",source:"omt","source-layer":"park",paint:{"fill-color":PARK,"fill-pattern":"hatch"}},
{id:"green",type:"fill",source:"omt","source-layer":"landcover",filter:["in",["get","class"],["literal",["grass","wood"]]],paint:{"fill-pattern":"hatch"}},
{id:"water",type:"fill",source:"omt","source-layer":"water",paint:{"fill-color":WATER}},
{id:"water-edge",type:"line",source:"omt","source-layer":"water",paint:{"line-color":"#9cc3ff","line-width":1.6}},
{id:"rail",type:"line",source:"omt","source-layer":"transportation",filter:["==",["get","class"],"rail"],paint:{"line-color":"#8a8fa6","line-width":1.4,"line-dasharray":[3,2]}},
{id:"rmc",type:"line",source:"omt","source-layer":"transportation",minzoom:13,filter:["in",["get","class"],["literal",["minor","service","tertiary"]]],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":INK,"line-width":roadW(0.9)}},
{id:"rMc",type:"line",source:"omt","source-layer":"transportation",filter:["in",["get","class"],["literal",["motorway","trunk","primary","secondary"]]],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":INK,"line-width":roadW(1.9)}},
{id:"rm",type:"line",source:"omt","source-layer":"transportation",minzoom:13,filter:["in",["get","class"],["literal",["minor","service","tertiary"]]],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#b9b2a3","line-width":roadW(0.5)}},
{id:"rM",type:"line",source:"omt","source-layer":"transportation",filter:["in",["get","class"],["literal",["motorway","trunk","primary","secondary"]]],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":ROAD,"line-width":roadW(1.3)}}]};
function hatch(){const n=12,c=document.createElement("canvas");c.width=c.height=n;const g=c.getContext("2d");g.fillStyle=PARK;g.fillRect(0,0,n,n);g.strokeStyle="#5fb37a";g.lineWidth=1.6;g.beginPath();g.moveTo(0,n);g.lineTo(n,0);g.moveTo(-n/2,n/2);g.lineTo(n/2,-n/2);g.moveTo(n/2,n+n/2);g.lineTo(n+n/2,n/2);g.stroke();return g.getImageData(0,0,n,n);}
'''
page='''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Rockumentary Photo Map Poster</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@500;700;900&family=Permanent+Marker&display=swap" rel="stylesheet">
<link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1587px;height:2245px;background:#14162a;overflow:hidden;font-family:"Roboto Condensed",sans-serif;position:relative}
#mapbox{position:absolute;left:181px;top:211px;width:1225px;height:1643px;border:5px solid #0b0c10;box-shadow:6px 6px 0 #000;overflow:hidden}
#map,#ov,#lines{position:absolute;inset:0}
#ov,#lines{pointer-events:none}
.maplibregl-ctrl-bottom-right,.maplibregl-ctrl-bottom-left{display:none}
.area{position:absolute;font:28px/1 "Permanent Marker";color:#f3e9d2;letter-spacing:.06em;white-space:nowrap;text-shadow:0 3px 0 rgba(0,0,0,.55);opacity:.85;transform:translate(-50%,-50%) rotate(var(--r))}
.area.s{font-size:21px;opacity:.7}
.pin{position:absolute;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;border:3px solid #0b0c10;box-shadow:3px 3px 0 #0b0c10;font:900 14px/24px "Roboto Condensed";text-align:center;color:#0b0c10}
.edge{position:absolute;display:flex;align-items:center;gap:6px;font:700 14px/1 "Roboto Condensed";color:#0b0c10;background:#f3e9d2;border:2px solid #0b0c10;border-radius:16px;padding:3px 9px 3px 3px;box-shadow:2px 2px 0 #0b0c10;white-space:nowrap}
.edge .pin{position:static;margin:0;width:24px;height:24px;font-size:12px;line-height:18px;box-shadow:none;border-width:2.5px}
.osm{position:absolute;right:8px;bottom:6px;font:500 11px "Roboto Condensed";color:rgba(243,233,210,.6)}
.tile{position:absolute;width:145px;height:175px;background:#f3e9d2;border:2.5px solid #0b0c10;box-shadow:4px 4px 0 #000;padding:6px 6px 0;transform:rotate(var(--r))}
.tile .ph{width:100%;height:118px;background:#2a2e47 center/cover no-repeat;border:1.5px solid #0b0c10;position:relative;filter:saturate(.85) contrast(1.05)}
.tile .ph.none{display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(45deg,var(--c) 0 6px,#0b0c10 6px 8px);opacity:.9}
.tile .ph.none span{font:16px "Permanent Marker";color:#0b0c10;background:#f3e9d2;padding:2px 6px;border:1.5px solid #0b0c10;transform:rotate(-4deg)}
.tile .cap{display:flex;align-items:flex-start;gap:5px;margin-top:6px}
.tile .n{flex:none;min-width:22px;height:22px;padding:0 3px;border-radius:11px;border:2px solid #0b0c10;font:900 12px/18px "Roboto Condensed";text-align:center;color:#0b0c10}
.tile .t{font:700 13px/1.1 "Roboto Condensed";color:#0b0c10;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.title{position:absolute;left:22px;top:22px;width:456px;height:175px;color:#f3e9d2;padding:4px 6px}
.title h1{font:54px/1 "Permanent Marker";letter-spacing:.01em}
.title p{font:700 14px/1.3 "Roboto Condensed";letter-spacing:.16em;text-transform:uppercase;color:#FFD54A;margin:4px 0 12px}
.key{display:grid;grid-template-columns:repeat(3,auto);gap:9px 18px;justify-content:start}
.key div{display:flex;align-items:center;gap:7px;font:700 16px/1 "Roboto Condensed"}
.key span{width:18px;height:18px;border-radius:50%;border:2.5px solid #0b0c10;outline:1.5px solid rgba(243,233,210,.4)}
</style></head><body>
<div class="title"><h1>Rockumentary</h1><p>Bangalore's rock map · 1930s to today</p><div class="key">__KEY__</div></div>
<div id="tiles"></div>
<div id="mapbox"><div id="map"></div><svg id="lines" width="1215" height="1633"></svg><div id="ov"></div><div class="osm">Map data © OpenStreetMap contributors · OpenFreeMap</div></div>
<script>
const ERAS=__ERAS__, PTS=__PTS__;
const AREAS=[["CANTONMENT",77.6150,12.9815,-6],["CUBBON PARK",77.5925,12.9770,-8],["RICHMOND TOWN",77.6060,12.9585,4,1],["ULSOOR",77.6215,12.9895,-5,1],["JAYAMAHAL",77.5990,13.0010,3,1],["SHIVAJINAGAR",77.6040,12.9900,-3,1],["RICHMOND RD",77.6170,12.9655,2,1]];
__STYLE__
// ---- polaroid slots, clockwise from after the title block ----
const TW=145,TH=175,M=22,GX=(1587-2*M-10*TW)/9,slots=[];
const col=i=>M+i*(TW+GX), rowY=[M, 2245-M-2*TH-10, 2245-M-TH];
for(let i=3;i<10;i++)slots.push([col(i),rowY[0]]);
const sideTop=M+TH+12, sideGap=(rowY[1]-12-sideTop-9*TH)/8;
for(let j=0;j<9;j++)slots.push([col(9),sideTop+j*(TH+sideGap)]);
for(let i=9;i>=0;i--)slots.push([col(i),rowY[1]]);
for(let i=0;i<10;i++)slots.push([col(i),rowY[2]]);
for(let j=8;j>=0;j--)slots.push([col(0),sideTop+j*(TH+sideGap)]);
const tiles=document.getElementById("tiles");
PTS.forEach((q,i)=>{const [x,y]=slots[i];const c=ERAS[q.e][1];const el=document.createElement("div");el.className="tile";
 el.style.cssText=`left:${x}px;top:${y}px;--r:${(((i*37)%9)-4)*0.45}deg;--c:${c}`;
 el.innerHTML=(q.img?`<div class="ph" style="background-image:url('${q.img}')"></div>`:`<div class="ph none"><span>photo wanted</span></div>`)+`<div class="cap"><span class="n" style="background:${c}">${q.n}</span><span class="t">${q.name}</span></div>`;tiles.appendChild(el);});
const map=new maplibregl.Map({container:"map",style:ST,center:[77.6045,12.9738],zoom:14.25,interactive:false,attributionControl:false,preserveDrawingBuffer:true});
map.on("styleimagemissing",e=>{if(e.id==="hatch"&&!map.hasImage("hatch"))map.addImage("hatch",hatch());});
const ov=document.getElementById("ov"),svg=document.getElementById("lines"),W=1215,H=1633;
function overlaps(a,b){return a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;}
map.once("idle",async()=>{
 await document.fonts.ready; await Promise.all([...document.querySelectorAll(".ph[style]")].map(d=>new Promise(r=>{const im=new Image();im.onload=im.onerror=r;im.src=d.style.backgroundImage.slice(5,-2);})));
 AREAS.forEach(([t,lng,lat,r,s])=>{const p=map.project([lng,lat]);const el=document.createElement("div");el.className="area"+(s?" s":"");el.style.setProperty("--r",r+"deg");el.textContent=t;el.style.left=p.x+"px";el.style.top=p.y+"px";ov.appendChild(el);});
 const inside=[],out=[];
 PTS.forEach(q=>{const p=map.project([q.lng,q.lat]);q.x=p.x;q.y=p.y;(p.x>18&&p.x<W-18&&p.y>18&&p.y<H-18?inside:out).push(q);});
 inside.forEach(q=>{q.ox=q.x;q.oy=q.y;});
 for(let it=0;it<300;it++){for(let i=0;i<inside.length;i++)for(let j=i+1;j<inside.length;j++){const a=inside[i],b=inside[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.1;if(d<34){const m=(34-d)/2;dx/=d;dy/=d;a.x-=dx*m;a.y-=dy*m;b.x+=dx*m;b.y+=dy*m;}}}
 let lines="";
 inside.forEach(q=>{if(Math.hypot(q.x-q.ox,q.y-q.oy)>3)lines+=`<line x1="${q.ox}" y1="${q.oy}" x2="${q.x}" y2="${q.y}" stroke="#0b0c10" stroke-width="4"/><line x1="${q.ox}" y1="${q.oy}" x2="${q.x}" y2="${q.y}" stroke="#f3e9d2" stroke-width="1.6"/><circle cx="${q.ox}" cy="${q.oy}" r="3.5" fill="#f3e9d2" stroke="#0b0c10" stroke-width="1.5"/>`;});
 svg.innerHTML=lines;
 inside.forEach(q=>{const el=document.createElement("div");el.className="pin";el.style.background=ERAS[q.e][1];el.style.left=q.x+"px";el.style.top=q.y+"px";el.textContent=q.n;ov.appendChild(el);});
 const placed=[];
 out.forEach(q=>{const km=Math.round(Math.hypot((q.lat-12.9716)*111,(q.lng-77.5946)*108));const dx=q.x-W/2,dy=q.y-H/2;
  const ar=Math.abs(dx)/W>Math.abs(dy)/H?(dx>0?"→":"←"):(dy>0?"↓":"↑");
  const el=document.createElement("div");el.className="edge";el.innerHTML=`<span class="pin" style="background:${ERAS[q.e][1]}">${q.n}</span>${q.name} · ${km} km ${ar}`;ov.appendChild(el);
  const w=el.offsetWidth,h=el.offsetHeight;let x=Math.min(Math.max(q.x-w/2,12),W-w-12),y=Math.min(Math.max(q.y-h/2,12),H-h-30);
  for(let t=0;t<20;t++){if(!placed.some(o=>overlaps(o,{x,y,w,h})))break;y+=(q.y>H/2?-1:1)*(h+8);}
  el.style.left=x+"px";el.style.top=y+"px";placed.push({x,y,w,h});});
 document.body.dataset.ready=1;
});
</script></body></html>'''
key=''.join(f'<div><span style="background:{c}"></span>{t}</div>' for t,c in ERAS)
page=page.replace('__KEY__',key).replace('__ERAS__',json.dumps(ERAS)).replace('__PTS__',json.dumps(pts,ensure_ascii=False)).replace('__STYLE__',STYLE)
open(OUT,'w').write(page); print(len(pts), sum(1 for q in pts if q['img']))
