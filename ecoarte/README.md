# ECOARTE — exposição digital

Apresentação escolar interativa em 14 slides. HTML5, CSS3 e JavaScript puro, sem dependências, backend ou etapa de build. Os modos Apresentação e Demonstração usam os mesmos slides e a mesma lógica de animação.

## Executar e visualizar

Abra `index.html` diretamente no navegador. Na tela inicial:

- **Iniciar apresentação**: experiência visual que ocupa a tela, com controles mínimos.
- **Demonstração**: mesma apresentação, com seletor dos 14 slides, reinício das animações e botão de tela cheia.

Para servir durante o desenvolvimento, na pasta do projeto execute `python3 -m http.server 8000` e abra `http://localhost:8000`. Isso é opcional; não é um backend necessário à apresentação.

**Controles:** seta direita ou Espaço avançam; seta esquerda volta; R reinicia a animação; Escape volta ao menu. Em botões e seletores, o teclado mantém o comportamento nativo. Deslize horizontalmente no celular ou use as setas na interface. A galeria do slide 6 abre os slides individuais dos artistas.

O botão Tela cheia solicita o modo nativo do navegador, que pode exigir interação do usuário. “Iniciar apresentação” já preenche a área disponível; use F11 no computador para ocultar também a interface do navegador. Em navegadores móveis sem Fullscreen API, o modo visual continua funcionando.

## Imagens locais

Esta versão inclui **ilustrações vetoriais originais como placeholders**, não fotografias nem reproduções das obras. Elas estão identificadas nos slides. Todo o visual funciona offline, e nenhum arquivo de imagem externo é solicitado.

Para incluir fotografias, copie arquivos autorizados para `assets/images/` e altere o atributo `src` das imagens em `index.html`. Atualize também `alt` e `figcaption`, incluindo o autor, a origem e a licença da imagem. Não remova os vetores: eles podem funcionar como reserva.

| Arquivo sugerido | Conteúdo |
| --- | --- |
| `spiral-jetty.jpg` | Spiral Jetty, de Robert Smithson; slides 4 e 7 e galeria |
| `beuys.jpg` | 7000 Carvalhos, de Joseph Beuys; galeria (slide 8 usa animação SVG) |
| `goldsworthy.jpg` | Obra efêmera de Andy Goldsworthy; slide 9 e galeria |
| `krajcberg.jpg` | Escultura com troncos/raízes de Frans Krajcberg; slide 10 e galeria |
| `vik-muniz.jpg` | Obra do projeto com catadores do Jardim Gramacho; galeria (slide 11 usa composição conceitual) |

Exemplo: troque `src="assets/images/spiral-jetty.svg"` por `src="assets/images/spiral-jetty.jpg"`. A camada escura do slide Land Art mantém a leitura sobre a fotografia. Se uma imagem faltar, o JavaScript tenta a ilustração `nature.svg` e preserva o espaço do layout.

Prefira fotografias horizontais com pelo menos 1600 px de largura, comprimidas para cerca de 300–700 KB. Não use URLs remotas. As imagens dos artistas podem estar protegidas por direitos autorais; mantenha créditos e use fontes com autorização apropriada.

## Editar textos e estilo

- **`index.html`**: conteúdo de cada `<section class="slide">`, legendas, textos alternativos. `data-title` define o título no seletor.
- **`css/style.css`**: identidade visual, composições e responsividade. Cores em `:root`; tamanhos de texto usam `clamp()`.
- **`css/animations.css`**: transições e animações, incluindo alternativa para `prefers-reduced-motion`.
- **`js/app.js`**: estado, navegação, touch, acessibilidade, tela cheia e tratamento de imagens.
- **`js/animations.js`**: criação dos SVGs/fragmentos e ciclo de entrada, saída e reinício.
- **`assets/textures/grain.svg`**: textura leve; **`assets/icons/leaf.svg`**: favicon.

As funções estão disponíveis em `window.Ecoarte`: `showSlide(index)`, `nextSlide()`, `previousSlide()`, `restartSlideAnimation()`, `enterPresentationMode()`, `enterPreviewMode()` e `getState()`. O índice começa em zero. O seletor é gerado a partir dos slides, sem duplicação de conteúdo.

Cada slide declara `data-transition`: `leaf`, `horizontal`, `paper`, `mask` ou `burn`. O reinício restaura também as animações descendentes. Não existe avanço automático: o apresentador controla o ritmo. Conceitos e etapas aparecem progressivamente dentro do slide; navegar novamente reinicia essa sequência.

## Publicar no GitHub Pages

1. Crie um repositório e envie **o conteúdo desta pasta** para a raiz, mantendo `index.html`, `css/`, `js/` e `assets/` juntos.
2. Em **Settings → Pages**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)`; salve.
4. Aguarde a publicação e abra o endereço informado pelo GitHub.

Se preferir, coloque todos os arquivos em `docs/` e selecione `/docs`. Os caminhos relativos funcionam em `https://usuario.github.io/repositorio/`; não dependem da raiz do domínio. O arquivo `.nojekyll` dispensa processamento Jekyll. Não há roteamento, fetch, fontes externas ou módulos que impeçam abrir por `file://`.

## Conteúdo e contexto

A apresentação distingue a origem na Land Art do propósito ambiental da Ecoarte. O projeto 7000 Carvalhos começou em 1982 e foi realizado ao longo dos anos. Lixo Extraordinário é o documentário que acompanha o trabalho de Vik Muniz com catadores. O retrato de fragmentos desta apresentação é uma composição abstrata original, não uma reprodução de uma obra do artista.

Para aprofundar e checar dados: [Dia Art Foundation — Spiral Jetty](https://www.diaart.org/visit/visit-our-locations-sites/robert-smithson-spiral-jetty), [documenta — arquivo](https://www.documenta.de/), [Vik Muniz — site oficial](https://vikmuniz.net/). Esses links são referências de leitura e não são carregados pela apresentação.

## Acessibilidade e desempenho

Navegação por teclado, foco visível, slides inativos fora da navegação assistiva, anúncios de mudança, texto alternativo e redução de movimento conforme configuração do sistema. Animações predominam em CSS; o parallax usa um único frame solicitado por movimento do ponteiro, sem loop permanente. Não há bibliotecas ou downloads durante a apresentação.

Veja `TESTES.md` para os resultados da verificação local. A publicação em uma conta GitHub depende de enviar os arquivos e ativar Pages.
