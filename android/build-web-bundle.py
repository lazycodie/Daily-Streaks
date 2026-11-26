"""Build the offline web bundle for the Android app from ../web-app/index.html.
Removes the cloud-sync code and remote fonts, adds a strict CSP, and points fonts at bundled files."""
import re, os
ROOT=os.path.dirname(os.path.abspath(__file__))
SRC=next(p for p in (os.path.join(ROOT,'..','web-app','index.html'), os.path.join(ROOT,'..','index.html')) if os.path.exists(p))
src=open(SRC).read()
W=os.path.join(ROOT,'app','src','main','assets','www')+'/'
css=re.search(r'<style>(.*?)</style>',src,re.S).group(1)
js=re.search(r'<script>(.*?)</script>',src,re.S).group(1)
body=src[src.index('</style>')+8:src.index('<script>')]
faces="@font-face{font-family:'Instrument Serif';font-style:normal;font-weight:400;font-display:swap;src:url(fonts/instrument-serif-latin-400-normal.woff2) format('woff2')}\n@font-face{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-display:swap;src:url(fonts/instrument-serif-latin-400-italic.woff2) format('woff2')}\n"
faces+=''.join(f"@font-face{{font-family:'Inter Tight';font-style:normal;font-weight:{w};font-display:swap;src:url(fonts/inter-tight-latin-{w}-normal.woff2) format('woff2')}}\n" for w in [400,500,600,700,800])
css=faces+css.replace("body{background:var(--bg);","body{margin:0;background:var(--bg);",1)
js=re.sub(r'/\*CLOUD-START\*/.*?/\*CLOUD-END\*/','',js,flags=re.S)
start=js.index('async function initStore(){'); end=js.index('function setStatus(')
js=js[:start]+'function initStore(){\n  habits = lsLoad(); render();\n  setStatus("Stored only on this phone. Nothing is sent anywhere.", true);\n}\n'+js[end:]
for a,b in [('function saveHabit(id){ lsSave(); if(mode!=="cloud") return; const body=JSON.parse(JSON.stringify(habits[id])); write(id, () => col.doc(id).set(body)); }','function saveHabit(id){ lsSave(); }'),
            ('function saveDay(id, date, v){ lsSave(); if(mode!=="cloud") return; write(id, () => col.doc(id).update({done:{[date]:v}})); }','function saveDay(id, date, v){ lsSave(); }'),
            ('function removeHabit(id){ delete habits[id]; lsSave(); if(mode!=="cloud") return; write(id, () => col.doc(id).delete()); }','function removeHabit(id){ delete habits[id]; lsSave(); }')]:
    assert a in js, a[:40]; js=js.replace(a,b)
for bad in ['claude.use','col.doc','onSnapshot','fetch(','XMLHttpRequest','WebSocket','sendBeacon']: assert bad not in js, bad
head='''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-src 'none'; object-src 'none'">
<meta name="referrer" content="no-referrer">
<meta name="color-scheme" content="dark light">
<title>Daily Streaks</title>
<link rel="stylesheet" href="app.css">
</head><body>'''
body=re.sub(r'<link[^>]*fonts\.g[^>]*>\n?','',body)
open(W+'index.html','w').write(head+body+'<script src="app.js"></script>\n</body></html>\n')
open(W+'app.css','w').write(css); open(W+'app.js','w').write(js)
print("web bundle written")
