/* ============================================================
   ANALYZER — detecta tecnologias, dependências, problemas,
               APIs externas e gera resumo do projeto
   ============================================================ */

function analisarTudo() {
  analisarTechs();
  analisarDeps();
  analisarApis();
  analisarCdns();
  analisarProblemas();
  gerarResumo();
}

// ── TECNOLOGIAS ──────────────────────────────────────────────
function analisarTechs() {
  const c = STATE.allContent();
  const techs = [];

  const mapa = [
    // Frameworks JS
    { name: 'React',          cor: 'blue',   icon: '⚛️',  check: () => c.includes('react') || c.includes('React') },
    { name: 'Vue.js',         cor: 'green',  icon: '💚',  check: () => c.includes('vue') || c.includes('Vue') },
    { name: 'Angular',        cor: 'red',    icon: '🔴',  check: () => c.includes('angular') || c.includes('@angular') },
    { name: 'Svelte',         cor: 'yellow', icon: '🔥',  check: () => c.includes('svelte') },
    { name: 'Next.js',        cor: 'blue',   icon: '▲',   check: () => c.includes('next/') || c.includes('"next"') },
    { name: 'Nuxt.js',        cor: 'green',  icon: '💚',  check: () => c.includes('nuxt') },
    { name: 'Solid.js',       cor: 'blue',   icon: '💙',  check: () => c.includes('solid-js') },

    // CSS
    { name: 'Tailwind CSS',   cor: 'blue',   icon: '🎨',  check: () => c.includes('tailwind') || c.includes('tw-') },
    { name: 'Bootstrap',      cor: 'purple', icon: '🅱️',  check: () => c.includes('bootstrap') },
    { name: 'Bulma',          cor: 'green',  icon: '🌿',  check: () => c.includes('bulma') },
    { name: 'Material UI',    cor: 'blue',   icon: '🎭',  check: () => c.includes('@mui') || c.includes('material-ui') },
    { name: 'Chakra UI',      cor: 'green',  icon: '⚡',  check: () => c.includes('@chakra-ui') },
    { name: 'Styled Comp.',   cor: 'purple', icon: '💅',  check: () => c.includes('styled-components') },

    // Build / Runtime
    { name: 'Vite',           cor: 'yellow', icon: '⚡',  check: () => c.includes('vite') || STATE.files.some(f => f.name === 'vite.config.js') },
    { name: 'Webpack',        cor: 'blue',   icon: '📦',  check: () => c.includes('webpack') || STATE.files.some(f => f.name === 'webpack.config.js') },
    { name: 'Parcel',         cor: 'yellow', icon: '📦',  check: () => c.includes('parcel') },
    { name: 'Rollup',         cor: 'red',    icon: '🔄',  check: () => c.includes('rollup') },
    { name: 'Electron',       cor: 'blue',   icon: '⚡',  check: () => c.includes('electron') },
    { name: 'Node.js',        cor: 'green',  icon: '🟢',  check: () => STATE.files.some(f => f.name === 'package.json') },
    { name: 'TypeScript',     cor: 'blue',   icon: '🔷',  check: () => STATE.files.some(f => f.type === 'ts' || f.type === 'tsx') || c.includes('typescript') },

    // Banco / Backend
    { name: 'Firebase',       cor: 'yellow', icon: '🔥',  check: () => c.includes('firebase') },
    { name: 'Supabase',       cor: 'green',  icon: '⚡',  check: () => c.includes('supabase') },
    { name: 'MongoDB',        cor: 'green',  icon: '🍃',  check: () => c.includes('mongodb') || c.includes('mongoose') },
    { name: 'SQLite',         cor: 'blue',   icon: '🗄️',  check: () => c.includes('sqlite') || c.includes('better-sqlite') },
    { name: 'Prisma',         cor: 'blue',   icon: '🔷',  check: () => c.includes('prisma') },
    { name: 'Drizzle',        cor: 'yellow', icon: '💧',  check: () => c.includes('drizzle') },

    // Utilitários
    { name: 'Axios',          cor: 'purple', icon: '🌐',  check: () => c.includes('axios') },
    { name: 'Zustand',        cor: 'yellow', icon: '🐻',  check: () => c.includes('zustand') },
    { name: 'Redux',          cor: 'purple', icon: '🔮',  check: () => c.includes('redux') },
    { name: 'React Query',    cor: 'red',    icon: '🔄',  check: () => c.includes('react-query') || c.includes('@tanstack/react-query') },
    { name: 'Zod',            cor: 'blue',   icon: '✅',  check: () => c.includes('zod') },
    { name: 'Lodash',         cor: 'blue',   icon: '🔧',  check: () => c.includes('lodash') },
    { name: 'Day.js',         cor: 'yellow', icon: '📅',  check: () => c.includes('dayjs') },
    { name: 'Moment.js',      cor: 'yellow', icon: '📅',  check: () => c.includes('moment') },
    { name: 'Chart.js',       cor: 'red',    icon: '📊',  check: () => c.includes('chart.js') || c.includes('Chart.js') },
    { name: 'D3.js',          cor: 'orange', icon: '📈',  check: () => c.includes('d3') },
    { name: 'Three.js',       cor: 'blue',   icon: '🎮',  check: () => c.includes('three') },
    { name: 'Socket.io',      cor: 'green',  icon: '🔌',  check: () => c.includes('socket.io') },
    { name: 'Express',        cor: 'green',  icon: '🚀',  check: () => c.includes('express') },
    { name: 'Fastify',        cor: 'yellow', icon: '⚡',  check: () => c.includes('fastify') },
    { name: 'Xterm.js',       cor: 'green',  icon: '💻',  check: () => c.includes('xterm') },
    { name: 'WebContainer',   cor: 'blue',   icon: '📦',  check: () => c.includes('webcontainer') },
    { name: 'Dexie',          cor: 'blue',   icon: '🗄️',  check: () => c.includes('dexie') || c.includes('Dexie') },
    { name: 'JSZip',          cor: 'yellow', icon: '🗜️',  check: () => c.includes('jszip') || c.includes('JSZip') },
    { name: 'PWA',            cor: 'purple', icon: '📱',  check: () => c.includes('manifest') || c.includes('service-worker') || c.includes('serviceWorker') },
    { name: 'IndexedDB',      cor: 'blue',   icon: '🗄️',  check: () => c.includes('indexedDB') || c.includes('IndexedDB') },
    { name: 'LocalStorage',   cor: 'green',  icon: '💾',  check: () => c.includes('localStorage') },
    { name: 'WebSocket',      cor: 'blue',   icon: '🔌',  check: () => c.includes('WebSocket') || c.includes('websocket') },
    { name: 'Web Workers',    cor: 'purple', icon: '⚙️',  check: () => c.includes('Worker(') || c.includes('new Worker') },
    { name: 'Canvas API',     cor: 'yellow', icon: '🎨',  check: () => c.includes('getContext(') },
    { name: 'Replit',         cor: 'red',    icon: '🔴',  check: () => c.includes('replit') || c.includes('repl.it') || c.includes('repl.co') },
  ];

  mapa.forEach(t => {
    try {
      if (t.check()) techs.push(t);
    } catch(e) {}
  });

  STATE.techs = techs;
}

// ── DEPENDÊNCIAS (package.json) ──────────────────────────────
function analisarDeps() {
  STATE.deps = [];
  const pkg = STATE.files.find(f => f.name === 'package.json');
  if (!pkg || pkg.binary) return;

  try {
    const json = JSON.parse(pkg.content);
    const deps    = Object.keys(json.dependencies    || {});
    const devDeps = Object.keys(json.devDependencies || {});

    STATE.deps = [
      ...deps.map(d    => ({ name: d, dev: false, version: json.dependencies[d] })),
      ...devDeps.map(d => ({ name: d, dev: true,  version: json.devDependencies[d] }))
    ];
  } catch(e) {}
}

// ── APIs EXTERNAS ────────────────────────────────────────────
function analisarApis() {
  const c = STATE.allContent();
  const apis = [];

  const mapa = [
    { name: 'OpenAI API',       check: () => c.includes('openai') || c.includes('api.openai.com') },
    { name: 'Google Maps',      check: () => c.includes('maps.googleapis') || c.includes('google.maps') },
    { name: 'Google Analytics', check: () => c.includes('gtag') || c.includes('analytics.google') },
    { name: 'Stripe',           check: () => c.includes('stripe') },
    { name: 'SendGrid',         check: () => c.includes('sendgrid') },
    { name: 'Twilio',           check: () => c.includes('twilio') },
    { name: 'AWS S3',           check: () => c.includes('amazonaws.com') || c.includes('aws-sdk') },
    { name: 'Cloudinary',       check: () => c.includes('cloudinary') },
    { name: 'Auth0',            check: () => c.includes('auth0') },
    { name: 'Clerk',            check: () => c.includes('@clerk') },
    { name: 'Vercel',           check: () => c.includes('vercel') },
    { name: 'Netlify',          check: () => c.includes('netlify') },
    { name: 'GitHub API',       check: () => c.includes('api.github.com') },
    { name: 'Unsplash API',     check: () => c.includes('unsplash') },
    { name: 'ViaCEP',           check: () => c.includes('viacep') },
    { name: 'IBGE API',         check: () => c.includes('servicodados.ibge') },
    { name: 'ReceitaWS',        check: () => c.includes('receitaws') },
  ];

  mapa.forEach(a => {
    try {
      if (a.check()) apis.push(a.name);
    } catch(e) {}
  });

  STATE.apis = apis;
}

// ── CDNs EXTERNAS ────────────────────────────────────────────
function analisarCdns() {
  const c = STATE.allContent();
  const regex = /https?:\/\/(?:cdn\.|cdnjs\.|unpkg\.|jsdelivr\.|fonts\.)[^\s"'<>)]+/g;
  const matches = c.match(regex) || [];
  STATE.cdns = [...new Set(matches)].slice(0, 20);
}

// ── PROBLEMAS ────────────────────────────────────────────────
function analisarProblemas() {
  const problemas = [];
  const c = STATE.allContent();

  // sem index.html
  const temIndex = STATE.files.some(f =>
    f.name === 'index.html' && !f.path.includes('node_modules')
  );
  if (!temIndex) {
    problemas.push({
      tipo:   'error',
      icon:   '❌',
      titulo: 'Falta index.html',
      desc:   'Nenhum arquivo index.html encontrado na raiz do projeto.',
      fix:    'Crie um index.html na raiz para servir como ponto de entrada.'
    });
  }

  // referências a localhost
  if (c.includes('http://localhost') || c.includes('http://127.0.0.1')) {
    problemas.push({
      tipo:   'warn',
      icon:   '⚠️',
      titulo: 'Referências a localhost',
      desc:   'O projeto contém URLs apontando para localhost ou 127.0.0.1.',
      fix:    'Substitua por caminhos relativos ou variáveis de ambiente.'
    });
  }

  // dependência da Replit
  if (c.includes('replit') || c.includes('repl.it') || c.includes('repl.co')) {
    problemas.push({
      tipo:   'error',
      icon:   '🔴',
      titulo: 'Dependência da Replit detectada',
      desc:   'O projeto referencia serviços ou domínios da Replit.',
      fix:    'Remova ou substitua as referências à Replit para rodar em outro ambiente.'
    });
  }

  // WebContainer (só funciona na Replit/StackBlitz)
  if (c.includes('webcontainer')) {
    problemas.push({
      tipo:   'error',
      icon:   '🔴',
      titulo: 'WebContainer API',
      desc:   'O projeto usa WebContainer, que só funciona em ambientes específicos como Replit e StackBlitz.',
      fix:    'Substitua por uma solução alternativa para rodar localmente.'
    });
  }

  // node_modules no zip
  if (STATE.files.some(f => f.path.includes('node_modules/'))) {
    problemas.push({
      tipo:   'warn',
      icon:   '⚠️',
      titulo: 'node_modules incluído no ZIP',
      desc:   'A pasta node_modules foi incluída no arquivo ZIP, tornando-o muito pesado.',
      fix:    'Delete a pasta node_modules e rode "npm install" após extrair.'
    });
  }

  // sem package.json
  const temPkg = STATE.files.some(f => f.name === 'package.json');
  if (!temPkg && STATE.isZip) {
    problemas.push({
      tipo:   'info',
      icon:   'ℹ️',
      titulo: 'Sem package.json',
      desc:   'Nenhum arquivo package.json encontrado. Pode ser um projeto sem Node.js.',
      fix:    'Se for um projeto Node.js, verifique se o package.json foi incluído no ZIP.'
    });
  }

  // arquivos com caminhos absolutos do Windows
  const temAbsoluto = STATE.files.some(f =>
    f.content && (f.content.includes('C:\\') || f.content.includes('C:/Users/'))
  );
  if (temAbsoluto) {
    problemas.push({
      tipo:   'warn',
      icon:   '⚠️',
      titulo: 'Caminhos absolutos do Windows',
      desc:   'Foram encontrados caminhos absolutos do Windows (C:\\...) no código.',
      fix:    'Substitua por caminhos relativos para funcionar em qualquer sistema.'
    });
  }

  // chaves de API expostas
  const padraoChave = /(?:api[_-]?key|apikey|secret|token|password)\s*[:=]\s*["'][^"']{8,}["']/i;
  if (padraoChave.test(c)) {
    problemas.push({
      tipo:   'error',
      icon:   '🔐',
      titulo: 'Possível chave de API exposta',
      desc:   'Foi encontrado o que parece ser uma chave de API ou senha no código.',
      fix:    'Mova credenciais para variáveis de ambiente (.env) e nunca as inclua no código.'
    });
  }

  // console.log excessivo
  const qtdLogs = (c.match(/console\.log/g) || []).length;
  if (qtdLogs > 20) {
    problemas.push({
      tipo:   'info',
      icon:   'ℹ️',
      titulo: `Muitos console.log (${qtdLogs} encontrados)`,
      desc:   'Excesso de console.log pode indicar código de debug não removido.',
      fix:    'Remova ou desative os console.log antes de publicar o projeto.'
    });
  }

  // arquivos muito grandes
  STATE.files.forEach(f => {
    if (f.size > 500000 && !f.binary) {
      problemas.push({
        tipo:   'warn',
        icon:   '⚠️',
        titulo: `Arquivo muito grande: ${f.name}`,
        desc:   `O arquivo ${f.path} tem ${fmtSize(f.size)}, o que pode causar lentidão.`,
        fix:    'Considere dividir o arquivo ou minificá-lo.'
      });
    }
  });

  // sem README
  const temReadme = STATE.files.some(f =>
    f.name.toLowerCase().startsWith('readme')
  );
  if (!temReadme && STATE.isZip) {
    problemas.push({
      tipo:   'info',
      icon:   'ℹ️',
      titulo: 'Sem README',
      desc:   'Nenhum arquivo README encontrado no projeto.',
      fix:    'Crie um README.md explicando como instalar e usar o projeto.'
    });
  }

  STATE.problems = problemas;
}

// ── RESUMO AUTOMÁTICO ────────────────────────────────────────
function gerarResumo() {
  const total   = STATE.files.length;
  const tipos   = {};
  STATE.files.forEach(f => {
    tipos[f.type] = (tipos[f.type] || 0) + 1;
  });

  const tipoStr = Object.entries(tipos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ext, n]) => `${n} .${ext}`)
    .join(', ');

  const techStr = STATE.techs.length > 0
    ? STATE.techs.map(t => t.name).join(', ')
    : 'nenhuma detectada';

  const erros   = STATE.problems.filter(p => p.tipo === 'error').length;
  const avisos  = STATE.problems.filter(p => p.tipo === 'warn').length;
  const infos   = STATE.problems.filter(p => p.tipo === 'info').length;

  const temReplit = STATE.techs.some(t => t.name === 'Replit') ||
                    STATE.problems.some(p => p.titulo.includes('Replit'));

  STATE.resumo = {
    total, tipos, tipoStr, techStr,
    erros, avisos, infos, temReplit
  };
}
