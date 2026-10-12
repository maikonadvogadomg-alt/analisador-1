# 📋 Plano do projeto: analisador-1

_Gerado em 12/10/2026, 17:50:33 — sem IA, lendo os arquivos._

## 📊 Visão geral
| Item | Valor |
|---|---|
| Arquivos | 43 |
| Linhas | 3.425 |
| Telas/páginas | 2 |
| Rotas do backend | 0 |
| Chamadas do app | 0 |
| Tabelas do banco | 0 |
| Variáveis de ambiente | 1 |

**Linguagens:** Imagem (15), JavaScript (11), CSS (4), JSON (3), YAML (2), Outros (2), HTML (2), Imagem SVG (2), Ícone (1), Markdown (1)

## 💡 O que fazer (em ordem)
1. 🧹 Tirar a Replit de 3 arquivo(s) (🏗️ Preparar → Fazer tudo)
2. 🔐 Criar um .env.example com: NOME_DA_CHAVE (os valores você coloca no servidor, nunca no código)
3. 📝 Criar um README.md explicando como rodar

## 🚀 Por onde começa
- `index.html`
- `js/app.js`

## ⌨️ Comandos (package.json)
| Pasta | Comando | O que roda |
|---|---|---|
| . | `npm run desktop` | `electron .` |
| . | `npm run exe` | `electron-builder --win portable --publish never` |

## 📱 Telas e páginas
| Endereço | Arquivo |
|---|---|
| `hub.html` | hub.html |
| `index.html` | index.html |

## 🖥️ Rotas do backend
_Nenhum encontrado._

## 📡 O que o app pede ao servidor
_Nenhum encontrado._

## 🔌 O que falta no backend
✅ Tudo que o app chama tem rota no projeto (ou o app não usa servidor).

## 🗄️ Banco de dados
_Nenhuma tabela encontrada._

## 🔐 Variáveis de ambiente (configurar no servidor)
- `NOME_DA_CHAVE`

_Só os nomes. Os valores (chaves, senhas) nunca vão no código nem no GitHub._

## 🧹 Arquivos com coisa da Replit
- js/analyzer.js
- js/builder.js
- service-worker.js

## 🔁 Roteiro para recriar fora da Replit
1. Importar o projeto no Mini SK e tocar em 🏗️ Preparar → ✅ Fazer tudo (tira a Replit, cria os arquivos que faltam).
2. Não tem backend: o site sozinho basta (Netlify ou GitHub Pages).
3. Variáveis: cadastrar 1 variável(is) no servidor (lista acima).
4. Testar a prévia; se der erro, 🤖 Mandar os erros para a IA.
5. App: 📲 Instalável (PWA), 📦 APK ou 🖥️ Desktop (.exe) pelo 🏗️ Preparar.

## 🌳 Árvore de arquivos
```
├─ 📁 .github/
│  └─ 📁 workflows/
│     ├─ apk.yml
│     └─ desktop-exe.yml
├─ 📁 css/
│  ├─ base.css
│  ├─ components.css
│  ├─ layout.css
│  └─ tabs.css
├─ 📁 electron/
│  ├─ main.cjs
│  └─ preload.cjs
├─ 📁 icons/
│  ├─ apple-touch-icon.png
│  ├─ icon-128.png
│  ├─ icon-144.png
│  ├─ icon-152.png
│  ├─ icon-16.png
│  ├─ icon-180.png
│  ├─ icon-192.png
│  ├─ icon-32.png
│  ├─ icon-384.png
│  ├─ icon-48.png
│  ├─ icon-512.png
│  ├─ icon-72.png
│  ├─ icon-96.png
│  ├─ icon.svg
│  ├─ maskable-192.png
│  ├─ maskable-512.png
│  └─ maskable.svg
├─ 📁 js/
│  ├─ analyzer.js
│  ├─ app.js
│  ├─ builder.js
│  ├─ db.js
│  ├─ loader.js
│  ├─ report.js
│  ├─ state.js
│  └─ viewer.js
├─ .gitignore
├─ apk.config.json
├─ favicon.ico
├─ hub.html
├─ hub.webmanifest
├─ index.html
├─ manifest.json
├─ package.json
├─ PLANO.md
└─ service-worker.js
```
