import json
SP='/tmp/claude-0/-home-user-DASHBOARD-CASE-STUDIES/573ba59d-e5f2-5406-845c-e9df8bbc9145/scratchpad'
OUT='/home/user/rockumentary-bangalore/merch/street-map-poster.html'
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
pts=[dict(name=p['name'],lat=p['lat'],lng=p['lng'],e=era(p)) for p in P if p['key']!='hangouts-11']
for q in pts:
    if q['name']=='Hotel Stay Longer': q['name']='Hotel Stay Longer / Ramada'
page='''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Rockumentary Street Map Poster</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@500;700;900&family=Permanent+Marker&display=swap" rel="stylesheet">
<link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1587px;height:2245px;background:#1f2336;overflow:hidden;font-family:"Roboto Condensed",sans-serif}
#map{position:absolute;inset:0 0 170px 0}
#ov{position:absolute;inset:0 0 170px 0;pointer-events:none}
.maplibregl-ctrl-bottom-right,.maplibregl-ctrl-bottom-left{display:none}
.area{position:absolute;font:30px/1 "Permanent Marker";color:#f3e9d2;letter-spacing:.06em;white-space:nowrap;text-shadow:0 3px 0 rgba(0,0,0,.55);opacity:.85;transform:translate(-50%,-50%) rotate(var(--r))}
.area.s{font-size:22px;opacity:.7}
.pin{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:3.5px solid #0b0c10;box-shadow:3px 3px 0 #0b0c10}
.lab{position:absolute;white-space:nowrap;font:700 15px/1 "Roboto Condensed";color:#0b0c10;background:#f3e9d2;border:2px solid #0b0c10;border-radius:4px;padding:4px 6px 3px;box-shadow:2px 2px 0 #0b0c10}
.lab b{font-weight:900}
.edge{position:absolute;font:700 15px/1.1 "Roboto Condensed";color:#f3e9d2;display:flex;align-items:center;gap:8px;white-space:nowrap}
.edge .pin{position:static;margin:0;flex:none}
.edge i{font-style:normal;font-size:20px;color:#f3e9d2}
.foot{position:absolute;left:0;right:0;bottom:0;height:170px;background:#14162a;border-top:5px solid #0b0c10;display:flex;align-items:center;padding:0 56px;gap:44px}
.foot h1{font:56px/1 "Permanent Marker";color:#f3e9d2;letter-spacing:.02em}
.foot h1 small{display:block;font:700 17px/1.4 "Roboto Condensed";letter-spacing:.18em;text-transform:uppercase;color:#FFD54A;margin-top:6px}
.key{display:grid;grid-template-columns:repeat(3,auto);gap:12px 30px;margin-left:auto}
.key div{display:flex;align-items:center;gap:10px;font:700 20px/1 "Roboto Condensed";color:#f3e9d2}
.key span{width:22px;height:22px;border-radius:50%;border:3px solid #0b0c10;box-shadow:2px 2px 0 #000;outline:1.5px solid rgba(243,233,210,.35)}
</style></head><body><div id="map"></div><svg id="lines" style="position:absolute;inset:0 0 170px 0;pointer-events:none;width:1587px;height:2075px"></svg><div id="ov"></div>
<div class="foot"><h1>Rockumentary<small>Bangalore's rock map · 1930s to today</small></h1><div class="key">__KEY__</div></div>
<script>
const ERAS=__ERAS__, PTS=__PTS__;
const AREAS=[["CANTONMENT",77.6150,12.9815,-6],["CUBBON PARK",77.5925,12.9770,-8],["RICHMOND TOWN",77.6060,12.9585,4,1],["ULSOOR",77.6250,12.9865,-5,1],["INDIRANAGAR",77.6400,12.9740,-7],["JAYAMAHAL",77.5990,13.0040,3,1],["SHIVAJINAGAR",77.6040,12.9900,-3,1],["LALBAGH",77.5850,12.9440,-4,1],["RICHMOND RD",77.6200,12.9655,2,1]];
const INK="#0b0c10",LAND="#1f2336",ROAD="#efe6d0",WATER="#2f6fd1",PARK="#2e6b4a";
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
const map=new maplibregl.Map({container:"map",style:ST,center:[77.6085,12.9725],zoom:14.3,interactive:false,attributionControl:false,preserveDrawingBuffer:true,pixelRatio:window.devicePixelRatio});
map.on("styleimagemissing",e=>{if(e.id==="hatch"&&!map.hasImage("hatch"))map.addImage("hatch",hatch());});
const ov=document.getElementById("ov"),svg=document.getElementById("lines"),W=1587,H=2075;
function overlaps(a,b){return a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;}
map.once("idle",async()=>{
 await document.fonts.ready;
 const boxes=[];
 AREAS.forEach(([t,lng,lat,r,s])=>{const p=map.project([lng,lat]);const el=document.createElement("div");el.className="area"+(s?" s":"");el.style.setProperty("--r",r+"deg");el.textContent=t;el.style.left=p.x+"px";el.style.top=p.y+"px";ov.appendChild(el);const b=el.getBoundingClientRect();boxes.push({x:b.left,y:b.top,w:b.width,h:b.height});});
 const inside=[],out=[];
 PTS.forEach(q=>{const p=map.project([q.lng,q.lat]);q.x=p.x;q.y=p.y;(p.x>20&&p.x<W-20&&p.y>20&&p.y<H-20?inside:out).push(q);});
 // separate overlapping pins
 inside.forEach(q=>{q.ox=q.x;q.oy=q.y;});
 for(let it=0;it<200;it++){for(let i=0;i<inside.length;i++)for(let j=i+1;j<inside.length;j++){const a=inside[i],b=inside[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.1;if(d<30){const m=(30-d)/2;dx/=d;dy/=d;a.x-=dx*m;a.y-=dy*m;b.x+=dx*m;b.y+=dy*m;}}}
 const pinB=inside.map(q=>({x:q.x-15,y:q.y-15,w:30,h:30}));
 let lines="";
 inside.forEach(q=>{if(Math.hypot(q.x-q.ox,q.y-q.oy)>3)lines+=`<line x1="${q.ox}" y1="${q.oy}" x2="${q.x}" y2="${q.y}" stroke="#0b0c10" stroke-width="4"/><line x1="${q.ox}" y1="${q.oy}" x2="${q.x}" y2="${q.y}" stroke="#f3e9d2" stroke-width="1.6"/><circle cx="${q.ox}" cy="${q.oy}" r="3.5" fill="#f3e9d2" stroke="#0b0c10" stroke-width="1.5"/>`;});
 // labels: greedy, densest first
 const placed=[];
 const order=[...inside].sort((a,b)=>{const n=q=>inside.filter(o=>Math.hypot(o.x-q.x,o.y-q.y)<120).length;return n(b)-n(a);});
 order.forEach(q=>{
  const el=document.createElement("div");el.className="lab";el.textContent=q.name;ov.appendChild(el);
  const w=el.offsetWidth,h=el.offsetHeight;let best=null;
  for(const R of [20,40,62,86,112,140,170]){for(let k=0;k<16&&!best;k++){const a=k*Math.PI/8;const cx=q.x+Math.cos(a)*R,cy=q.y+Math.sin(a)*R;
    let x=Math.cos(a)>.3?cx:Math.cos(a)<-.3?cx-w:cx-w/2;let y=Math.sin(a)>.3?cy:Math.sin(a)<-.3?cy-h:cy-h/2;
    const b={x:x-3,y:y-3,w:w+6,h:h+6};if(b.x<8||b.y<8||b.x+b.w>W-8||b.y+b.h>H-8)continue;
    if(placed.some(o=>overlaps(o,b))||pinB.some(o=>overlaps(o,b))||boxes.some(o=>overlaps(o,b)))continue;best={x,y,R,cx,cy};}if(best)break;}
  if(!best)best={x:q.x+16,y:q.y-h/2,R:0};
  el.style.left=best.x+"px";el.style.top=best.y+"px";placed.push({x:best.x-3,y:best.y-3,w:w+6,h:h+6});
  if(best.R>30){const tx=Math.min(Math.max(q.x,best.x),best.x+w),ty=Math.min(Math.max(q.y,best.y),best.y+h);lines+=`<line x1="${q.x}" y1="${q.y}" x2="${tx}" y2="${ty}" stroke="#0b0c10" stroke-width="3.5"/><line x1="${q.x}" y1="${q.y}" x2="${tx}" y2="${ty}" stroke="#f3e9d2" stroke-width="1.4"/>`;}
 });
 svg.innerHTML=lines;
 inside.forEach(q=>{const el=document.createElement("div");el.className="pin";el.style.background=ERAS[q.e][1];el.style.left=q.x+"px";el.style.top=q.y+"px";ov.appendChild(el);});
 // off-map places: arrows on the edge
 const c=map.getCenter();
 out.forEach(q=>{const km=Math.round(Math.hypot((q.lat-12.9716)*111,(q.lng-77.5946)*108));const el=document.createElement("div");el.className="edge";
  const dx=q.x-W/2,dy=q.y-H/2,ang=Math.atan2(dy,dx)*180/Math.PI;const arrow=Math.abs(dx)>Math.abs(dy)*W/H?(dx>0?"→":"←"):(dy>0?"↓":"↑");
  el.innerHTML=(arrow==="←"?`<i>←</i>`:"")+`<span class="pin" style="background:${ERAS[q.e][1]}"></span><span class="lab" style="position:static">${q.name} · ${km} km</span>`+(arrow!=="←"?`<i>${arrow}</i>`:"");
  ov.appendChild(el);const w=el.offsetWidth,h=el.offsetHeight;
  let x=Math.min(Math.max(q.x-w/2,24),W-w-24),y=Math.min(Math.max(q.y-h/2,24),H-h-24);
  for(let t=0;t<20;t++){const b={x,y,w,h};if(!placed.some(o=>overlaps(o,b)))break;y+= (q.y>H/2?-1:1)*(h+8);}
  el.style.left=x+"px";el.style.top=y+"px";placed.push({x,y,w,h});});
 document.body.dataset.ready=1;
});
</script></body></html>'''
key=''.join(f'<div><span style="background:{c}"></span>{t}</div>' for t,c in ERAS)
page=page.replace('__KEY__',key).replace('__ERAS__',json.dumps(ERAS)).replace('__PTS__',json.dumps(pts,ensure_ascii=False))
open(OUT,'w').write(page); print(len(pts))
