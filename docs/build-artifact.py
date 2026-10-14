# builds rockumentary-artifact.html from rockumentary-map/index.html for the shareable web link
import base64, re
s = open('rockumentary-map/index.html').read()
head = re.search(r'<head>(.*?)</head>', s, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', s, re.S).group(1)
head = re.sub(r'\s*<meta[^>]*>', '', head)
head = re.sub(r'\s*<title>.*?</title>', '', head)
head = head.replace('<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css">', '')
head = head.replace('https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js', 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js')
# the essential MapLibre styles, inlined (only Google Fonts stylesheets may load from outside)
ml_css = """<title>Rockumentary Map</title>
<style>
.maplibregl-map{position:relative;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);font:12px/20px Helvetica Neue,Arial,sans-serif}
.maplibregl-canvas{position:absolute;left:0;top:0}
.maplibregl-canvas-container.maplibregl-interactive{cursor:grab}
.maplibregl-ctrl-top-right,.maplibregl-ctrl-bottom-right,.maplibregl-ctrl-top-left,.maplibregl-ctrl-bottom-left{position:absolute;pointer-events:none;z-index:2}
.maplibregl-ctrl-top-right{top:0;right:0}.maplibregl-ctrl-bottom-right{bottom:0;right:0}.maplibregl-ctrl-top-left{top:0;left:0}.maplibregl-ctrl-bottom-left{bottom:0;left:0}
.maplibregl-ctrl{clear:both;pointer-events:auto;transform:translate(0)}
.maplibregl-ctrl-top-right .maplibregl-ctrl{float:right;margin:10px 10px 0 0}.maplibregl-ctrl-bottom-right .maplibregl-ctrl{float:right;margin:0 10px 10px 0}
.maplibregl-ctrl-group{background:#fff;border-radius:4px;box-shadow:0 0 0 2px rgba(0,0,0,.1)}
.maplibregl-ctrl-group button{width:29px;height:29px;display:block;padding:0;border:0;background:transparent;cursor:pointer}
.maplibregl-ctrl-group button+button{border-top:1px solid #ddd}
.maplibregl-ctrl-attrib{padding:0 5px;background:rgba(255,255,255,.5);font-size:11px}
.maplibregl-ctrl-attrib a{color:rgba(0,0,0,.75);text-decoration:none}
.maplibregl-ctrl-attrib-button{display:none}
.maplibregl-ctrl-scale{background:rgba(255,255,255,.75);border:2px solid #333;border-top:0;color:#333;font-size:10px;padding:0 5px}
.maplibregl-marker{position:absolute;top:0;left:0;will-change:transform;transition:opacity .2s}
.maplibregl-popup{position:absolute;top:0;left:0;display:flex;will-change:transform;pointer-events:none}
.maplibregl-popup-anchor-top,.maplibregl-popup-anchor-top-left,.maplibregl-popup-anchor-top-right{flex-direction:column}
.maplibregl-popup-anchor-bottom,.maplibregl-popup-anchor-bottom-left,.maplibregl-popup-anchor-bottom-right{flex-direction:column-reverse}
.maplibregl-popup-anchor-left{flex-direction:row}.maplibregl-popup-anchor-right{flex-direction:row-reverse}
.maplibregl-popup-tip{width:0;height:0;border:10px solid transparent;z-index:1}
.maplibregl-popup-anchor-bottom .maplibregl-popup-tip{align-self:center;border-bottom:none;border-top-color:#fff}
.maplibregl-popup-anchor-top .maplibregl-popup-tip{align-self:center;border-top:none;border-bottom-color:#fff}
.maplibregl-popup-anchor-left .maplibregl-popup-tip{align-self:center;border-left:none;border-right-color:#fff}
.maplibregl-popup-anchor-right .maplibregl-popup-tip{align-self:center;border-right:none;border-left-color:#fff}
.maplibregl-popup-close-button{position:absolute;right:0;top:0;border:0;border-radius:0 3px 0 0;cursor:pointer;background:transparent}
.maplibregl-popup-content{position:relative;background:#fff;border-radius:3px;box-shadow:0 1px 2px rgba(0,0,0,.1);padding:15px 10px;pointer-events:auto}
.maplibregl-crosshair,.maplibregl-crosshair .maplibregl-interactive{cursor:crosshair}
</style>"""
# embed local photos so the page is self-contained
def embed(m):
    b = base64.b64encode(open('rockumentary-map/' + m.group(1), 'rb').read()).decode()
    return 'src:"data:image/jpeg;base64,' + b + '"'
body = re.sub(r'src:"(media/images/[^"]+\.jpe?g)"', embed, body)
# MapLibre defaults go FIRST so the page's own dark styles win
out = ml_css + "\n" + head.strip() + "\n" + body.strip() + "\n"
open('rockumentary-artifact.html', 'w').write(out)
print(len(out), out[:120].replace("\n", " "))
