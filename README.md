# my-personal-cv

Site pessoal para visualizar e baixar meu currículo, publicado no GitHub Pages.

## Como atualizar o currículo

1. Substitua o arquivo `cv.pdf` na raiz do repositório pelo novo PDF (mantenha o nome `cv.pdf`).
2. Commit e push para `main`:
   ```bash
   git add cv.pdf
   git commit -m "Atualiza currículo"
   git push
   ```
3. Pronto. A GitHub Action (`.github/workflows/deploy.yml`) publica o site automaticamente e atualiza
   a data "Atualizado em" com base no último commit que alterou `cv.pdf` — nada mais precisa ser editado.

## Configuração inicial do GitHub Pages (uma única vez)

No repositório, em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
Depois do primeiro push, o site fica disponível em `https://<usuario>.github.io/<repo>/`.

## Rodando localmente

Como o site busca `last-updated.json` via `fetch`, abrir o `index.html` direto no navegador (`file://`)
não carrega esse arquivo (a data cai no fallback "ver PDF"). Para testar igual ao ambiente real, suba um
servidor local na pasta:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Stack

Apenas HTML, CSS e JavaScript puro — sem build step. O fundo animado usa Three.js (via CDN). O visualizador
de PDF usa o viewer nativo do navegador dentro de um `<iframe>`.
