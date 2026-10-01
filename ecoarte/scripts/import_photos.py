from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
import json, re

root = Path("ecoarte")
sources = [
("spiral-jetty", "https://upload.wikimedia.org/wikipedia/commons/8/84/Spiral-jetty-from-rozel-point.png", "Spiral Jetty — Robert Smithson, 1970", "https://commons.wikimedia.org/wiki/File:Spiral-jetty-from-rozel-point.png"),
("beuys", "https://upload.wikimedia.org/wikipedia/commons/b/bd/Kassel-beuys-7000-eichen-wegmann-v-o.jpg", "7000 Carvalhos — Joseph Beuys · foto: Keichwa · CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Kassel-beuys-7000-eichen-wegmann-v-o.jpg"),
("goldsworthy", "https://upload.wikimedia.org/wikipedia/commons/2/2f/Andy_Goldsworthy-Fold1.jpg", "Fold — Andy Goldsworthy", "https://commons.wikimedia.org/wiki/File:Andy_Goldsworthy-Fold1.jpg"),
("krajcberg", "https://upload.wikimedia.org/wikipedia/commons/4/4d/Espa_o_Cultural_Frans_Krajcberg_-_Curitiba_%2840833438%29.jpg", "Esculturas de Frans Krajcberg — espaço cultural em Curitiba", "https://commons.wikimedia.org/wiki/File:Espa_o_Cultural_Frans_Krajcberg_-_Curitiba_(40833438).jpg"),
("vik-muniz", "https://raw.githubusercontent.com/felipegangorra/gangorraflix/2f4e2d3e1407515c959f1fc3caff83d29c43b69a/img/documentario/d1.jpg", "Lixo Extraordinário — cartaz do documentário, 2010", "https://github.com/felipegangorra/gangorraflix/blob/2f4e2d3e1407515c959f1fc3caff83d29c43b69a/img/documentario/d1.jpg")
]
def download(item):
    name,url,caption,page=item
    req=Request(url,headers={"User-Agent":"EcoarteSchoolPresentation/1.0 (educational; https://github.com/eriksmoura14-ai/Apresenta-o-slide)"})
    with urlopen(req,timeout=20) as response:
        data=response.read(12*1024*1024)
    if data.startswith(b"\x89PNG"): ext="png"
    elif data.startswith(b"\xff\xd8"): ext="jpg"
    else: raise RuntimeError("Invalid image response: "+name)
    (root / ("assets/images/"+name+"."+ext)).write_bytes(data)
    print("PHOTO_OK",name,len(data),flush=True)
    return dict(name=name,file=name+"."+ext,caption=caption,source=page)
with ThreadPoolExecutor(max_workers=5) as pool:
    photos=list(pool.map(download,sources))
html=(root/"index.html").read_text()
for photo in photos:
    name=photo["name"]
    html=html.replace("assets/images/"+name+".svg","assets/images/"+photo["file"])
    html=html.replace('alt="Ilustração conceitual de Spiral Jetty"','alt="Fotografia de Spiral Jetty, de Robert Smithson"')
    html=html.replace('alt="Estudo gráfico de uma espiral na paisagem"','alt="Fotografia de Spiral Jetty no Grande Lago Salgado"')
    html=html.replace('alt="Composição ilustrada de folhas"','alt="Fotografia da escultura Fold, de Andy Goldsworthy"')
    html=html.replace('alt="Estudo gráfico de troncos secos"','alt="Fotografia de esculturas de Frans Krajcberg em Curitiba"')
    html=html.replace('alt="Espiral ilustrada"','alt="Spiral Jetty, Robert Smithson"')
    html=html.replace('alt="Árvores ilustradas"','alt="7000 Carvalhos, Joseph Beuys"')
    html=html.replace('alt="Folhas ilustradas"','alt="Fold, Andy Goldsworthy"')
    html=html.replace('alt="Troncos ilustrados"','alt="Esculturas de Frans Krajcberg"')
    html=html.replace('alt="Fragmentos ilustrados"','alt="Cartaz do documentário Lixo Extraordinário"')
html=html.replace("ESTUDO VISUAL · SUBSTITUA POR FOTOGRAFIA DE LAND ART","SPIRAL JETTY · ROBERT SMITHSON · 1970")
html=html.replace("ESTUDO VISUAL · SPIRAL JETTY","SPIRAL JETTY · ROBERT SMITHSON · 1970")
html=html.replace("ESTUDO VISUAL · ARTE EFÊMERA","FOLD · ANDY GOLDSWORTHY")
html=html.replace("ESTUDO VISUAL · TRONCOS E RAÍZES","ESCULTURAS DE FRANS KRAJCBERG · CURITIBA")
html=html.replace('<div id="forest" class="forest" aria-label="Animação de sementes crescendo em árvores"></div>', '<figure class="artist-image real-beuys"><img src="assets/images/beuys.jpg" alt="Árvores e colunas de basalto de 7000 Carvalhos em Kassel"><figcaption>7000 CARVALHOS · FOTO: KEICHWA · CC BY-SA 3.0</figcaption></figure><div id="forest" class="forest" hidden></div>')
html=html.replace('<div class="fragment-art"><div id="fragments" aria-hidden="true"></div><strong>LIXO <span>→</span> ARTE</strong><small>COMPOSIÇÃO CONCEITUAL EM FRAGMENTOS</small></div>', '<figure class="artist-image real-muniz"><img src="assets/images/vik-muniz.jpg" alt="Cartaz do documentário Lixo Extraordinário, sobre o trabalho de Vik Muniz com catadores"><figcaption>LIXO EXTRAORDINÁRIO · CARTAZ DO DOCUMENTÁRIO · 2010</figcaption></figure><div id="fragments" hidden aria-hidden="true"></div>')
html=html.replace('<div id="drifting-leaves" aria-hidden="true"></div>','<div id="drifting-leaves" hidden aria-hidden="true"></div>')
(root/"index.html").write_text(html)
with (root/"css/style.css").open("a") as f:
    f.write("\n/* Documentary photography: keep the artwork complete and readable. */\n.beuys{display:grid;grid-template-columns:43% 57%;gap:0}.real-beuys img,.real-muniz img,.goldsworthy .artist-image img,.krajcberg .artist-image img{object-fit:contain;background:#172b23}.real-muniz{background:#172b23}.krajcberg .artist-image{filter:none;opacity:1}.goldsworthy .artist-image{clip-path:none}.smithson .artist-image{border-radius:2px}.artist-image figcaption{left:0;right:0;bottom:0;line-height:1.6;font-size:10px;padding:12px;background:#172b23ed}.art-card img{filter:none}.real-muniz img{padding:0 0 42px}.full-art img{object-fit:cover}.beuys .artist-copy{padding-right:25px}@media(max-width:700px){.beuys{display:flex;flex-direction:column;align-items:stretch;gap:18px}.beuys .artist-copy{padding-right:0}.artist-image figcaption{font-size:8px;padding:8px}.real-muniz img{padding-bottom:30px}}\n")
credits="# Fotografias e fontes\n\nAs imagens desta atualização são registros fotográficos, sem geração por IA. O cartaz de Lixo Extraordinário é material do documentário, não uma fotografia isolada de obra. Fold é uma escultura em pedra de Goldsworthy; a imagem não representa suas obras de folhas ou gelo.\n\n"
for photo in photos: credits+="## "+photo["name"]+"\n\n"+photo["caption"]+"\n\nFonte e informações de autoria/licença: "+photo["source"]+"\n\nArquivo local: assets/images/"+photo["file"]+"\n\n"
(root/"assets/images/CREDITOS.md").write_text(credits)
(root/"assets/images/photos.json").write_text(json.dumps(photos,ensure_ascii=False,indent=2))
