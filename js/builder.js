/* ============================================================
   BUILDER — monta todas as telas com os dados do STATE
   ============================================================ */

function montarTudo() {
  montarStats();
  montarTechs();
  montarDeps();
  montarApis();
  montarResumoTexto();
  montarArquivos();
  montarArvore();
  montarProblemas();
  montarPlano();
  montarRelatorio();
  iniciarAbas();
}

// ── ESTATÍSTICAS ─────────────────────────────────────────────
function montarStats() {
  const r = STATE.resumo;
  const erros  = STATE.problems.filter(p => p.tipo === 'error').length;
  const avisos = STATE.problems.filter(p => p.tipo === 'warn').length;

  document.getElementById('statsGrid').innerHTML = `
    ${statCard(STATE.files.length,          '📁 Arquivos')}
    ${statCard(fmtSize(STATE.totalSize()),   '⚖️ Tamanho')}
    ${statCard(STATE.totalLines().toLocaleString(), '📝 Linhas')}
    ${statCard(STATE.techs.length,           '🔧 Tecnologias')}
    ${statCard(STATE.deps.length,            '📦 Dependências')}
    ${statCard(erros,                        '❌ Erros')}
    ${statCard(avisos,                       '⚠️ Avisos')}
    ${statCard(STATE.apis.length,            '🌐 APIs')}
  `;
}

function statCard(num, label) {
  return `
    <div class="stat-card">
      <div class="num">${num}</div>
      <div class="label">${label}</div>
    </div>`;
}

// ── TECNOLOGIAS ──────────────────────────────────────────────
function montarTechs() {
  const el = document.getElementById('techBadges');
  if (STATE.techs.length === 0) {
    el.innerHTML = `<span class="text-muted">Nenhuma tecnologia detectada</span>`;
    return;
  }
  el.innerHTML = STATE.techs.map(t =>
    `<span class="badge badge-${t.cor}">${t.icon} ${t.name}</span>`
  ).join('');
}

// ── DEPENDÊNCIAS ─────────────────────────────────────────────
function montarDeps() {
  const el = document.getElementById('depsList');
  if (STATE.deps.length === 0) {
    el.innerHTML = `<span class="text-muted">Nenhum package.json encontrado</span>`;
    return;
  }

  const deps    = STATE.deps.filter(d => !d.dev);
  const devDeps = STATE.deps.filter(d => d.dev);

  let html = '';

  if (deps.length > 0) {
    html += `<div style="margin-bottom:10px">
      <div style="font-size:0.78rem;color:var(--text-muted);
      margin-bottom:6px;font-weight:600">
        PRODUÇÃO (${deps.length})
      </div>`;
    html += deps.map(d =>
      `<div style="display:flex;justify-content:space-between;
       padding:3px 0;border-bottom:1px solid var(--bg-hover);
       font-size:0.83rem">
         <span style="color:var(--text-primary)">${d.name}</span>
         <span style="color:var(--text-muted)">${d.version}</span>
       </div>`
    ).join('');
    html += `</div>`;
  }

  if (devDeps.length > 0) {
    html += `<div>
      <div style="font-size:0.78rem;color:var(--text-muted);
      margin-bottom:6px;font-weight:600">
        DESENVOLVIMENTO (${devDeps.length})
      </div>`;
    html += devDeps.map(d =>
      `<div style="display:flex;justify-content:space-between;
       padding:3px 0;border-bottom:1px solid var(--bg-hover);
       font-size:0.83rem">
         <span style="color:var(--text-muted)">${d.name}</span>
         <span style="color:var(--text-muted)">${d.version}</span>
       </div>`
    ).join('');
    html += `</div>`;
  }

  el.innerHTML = html;
}

// ── APIs ─────────────────────────────────────────────────────
function montarApis() {
  const el = document.getElementById('apiList');

  if (STATE.apis.length === 0 && STATE.cdns.length === 0) {
    el.innerHTML = `<span class="text-muted">Nenhuma API externa detectada</span>`;
    return;
  }

  let html = '';

  if (STATE.apis.length > 0) {
    html += STATE.apis.map(a =>
      `<span class="badge badge-blue">🌐 ${a}</span>`
    ).join('');
  }

  if (STATE.cdns.length > 0) {
    html += `<div style="margin-top:10px">
      <div style="font-size:0.78rem;color:var(--text-muted);
      margin-bottom:6px;font-weight:600">CDNs EXTERNAS</div>`;
    html += STATE.cdns.map(cdn =>
      `<div style="font-size:0.78rem;color:var(--blue-text);
       padding:2px 0;font-family:monospace;
       word-break:break-all">${cdn}</div>`
    ).join('');
    html += `</div>`;
  }

  el.innerHTML = html;
}

// ── RESUMO TEXTO ─────────────────────────────────────────────
function montarResumoTexto() {
  const r      = STATE.resumo;
  const erros  = STATE.problems.filter(p => p.tipo === 'error').length;
  const avisos = STATE.problems.filter(p => p.tipo === 'warn').length;

  let html = `
    <p>📦 O projeto <strong>${STATE.projectName}</strong>
    contém <strong>${r.total} arquivo(s)</strong>
    (${r.tipoStr}), totalizando
    <strong>${fmtSize(STATE.totalSize())}</strong> e
    <strong>${STATE.totalLines().toLocaleString()} linhas</strong>
    de código.</p>`;

  if (STATE.techs.length > 0) {
    html += `<p>🔧 Tecnologias detectadas:
    <strong>${r.techStr}</strong>.</p>`;
  }

  if (STATE.apis.length > 0) {
    html += `<p>🌐 APIs externas utilizadas:
    <strong>${STATE.apis.join(', ')}</strong>.</p>`;
  }

  if (erros > 0 || avisos > 0) {
    html += `<p>⚠️ Foram encontrados
    <strong style="color:var(--red-text)">${erros} erro(s)</strong> e
    <strong style="color:var(--yellow-text)">${avisos} aviso(s)</strong>
    que precisam de atenção.</p>`;
  } else {
    html += `<p>✅ Nenhum problema crítico detectado automaticamente.</p>`;
  }

  if (r.temReplit) {
    html += `<p>🔴 <strong>Atenção:</strong> O projeto possui
    <strong>dependências da Replit</strong> que precisam ser
    removidas para funcionar em outro ambiente.</p>`;
  }

  document.getElementById('resumoTexto').innerHTML = html;
}

// ── LISTA DE ARQUIVOS ────────────────────────────────────────
function montarArquivos() {
  renderArquivos(STATE.files);
}

function renderArquivos(lista) {
  const el = document.getElementById('fileList');
  if (lista.length === 0) {
    el.innerHTML = `<li style="padding:20px;text-align:center;
    color:var(--text-muted)">Nenhum arquivo encontrado</li>`;
    return;
  }

  el.innerHTML = lista.map(f => {
    const cor   = corPorTipo(f.type);
    const icone = iconePorTipo(f.type);
    return `
      <li class="file-item" onclick="abrirArquivo('${escapar(f.path)}')">
        <div class="file-info">
          <div class="file-name">${icone} ${f.name}</div>
          <div class="file-path">${f.path}</div>
        </div>
        <span class="file-size">${fmtSize(f.size)}</span>
        <span class="file-type-badge badge badge-${cor}">.${f.type}</span>
      </li>`;
  }).join('');
}

function filtrarArquivos() {
  const termo = document.getElementById('fileSearch')
    .value.toLowerCase().trim();
  if (!termo) {
    renderArquivos(STATE.files);
    return;
  }
  const filtrado = STATE.files.filter(f =>
    f.name.toLowerCase().includes(termo) ||
    f.type.toLowerCase().includes(termo) ||
    f.path.toLowerCase().includes(termo)
  );
  renderArquivos(filtrado);
}

// ── ÁRVORE DE ARQUIVOS ───────────────────────────────────────
function montarArvore() {
  const arvore = {};

  STATE.files.forEach(f => {
    const partes = f.path.split('/');
    let no = arvore;
    partes.forEach((p, i) => {
      if (i === partes.length - 1) {
        no[p] = f;
      } else {
        if (!no[p]) no[p] = {};
        no = no[p];
      }
    });
  });

  document.getElementById('treeView').innerHTML =
    renderArvore(arvore, 0);
}

function renderArvore(no, nivel) {
  const indent = '&nbsp;'.repeat(nivel * 4);
  let html = '';

  Object.keys(no).sort((a, b) => {
    const aDir = typeof no[a] === 'object' && !no[a].path;
    const bDir = typeof no[b] === 'object' && !no[b].path;
    if (aDir && !bDir) return -1;
    if (!aDir && bDir) return 1;
    return a.localeCompare(b);
  }).forEach(chave => {
    const val = no[chave];
    const ehArq = val && val.path;

    if (ehArq) {
      const icone = iconePorTipo(val.type);
      html += `<div class="tree-item">
        ${indent}
        <span class="tree-file"
          onclick="abrirArquivo('${escapar(val.path)}')">
          ${icone} ${chave}
        </span>
        <span style="color:var(--text-muted);font-size:0.75rem;
        margin-left:8px">${fmtSize(val.size)}</span>
      </div>`;
    } else {
      html += `<div class="tree-item">
        ${indent}
        <span class="tree-folder">📁 ${chave}/</span>
      </div>`;
      html += renderArvore(val, nivel + 1);
    }
  });

  return html;
}

// ── PROBLEMAS ────────────────────────────────────────────────
function montarProblemas() {
  const el = document.getElementById('problemsList');

  if (STATE.problems.length === 0) {
    el.innerHTML = `
      <div class="problem-item problem-ok">
        <div class="problem-icon">✅</div>
        <div>
          <div class="problem-title">Nenhum problema detectado</div>
          <div class="problem-desc">
            A análise automática não encontrou problemas no projeto.
          </div>
        </div>
      </div>`;
    return;
  }

  el.innerHTML = STATE.problems.map(p => `
    <div class="problem-item problem-${p.tipo}">
      <div class="problem-icon">${p.icon}</div>
      <div>
        <div class="problem-title">${p.titulo}</div>
        <div class="problem-desc">${p.desc}</div>
        ${p.fix
          ? `<div class="problem-fix">💡 ${p.fix}</div>`
          : ''}
      </div>
    </div>
  `).join('');
}

// ── PLANO DE MELHORIAS ───────────────────────────────────────
function montarPlano() {
  const el     = document.getElementById('planoConteudo');
  const r      = STATE.resumo;
  const secoes = [];

  // remover dependências da Replit
  if (r.temReplit) {
    secoes.push({
      icon:      '🔴',
      titulo:    'Remover Dependências da Replit',
      prioridade:'alta',
      itens: [
        'Busque por <code>replit</code>, <code>repl.it</code> e <code>repl.co</code> em todos os arquivos',
        'Remova ou substitua qualquer import ou referência a serviços da Replit',
        'Substitua o WebContainer API por uma solução local se necessário',
        'Teste o projeto em um servidor local após a remoção'
      ]
    });
  }

  // localhost
  if (STATE.problems.some(p => p.titulo.includes('localhost'))) {
    secoes.push({
      icon:      '🌐',
      titulo:    'Corrigir URLs de Localhost',
      prioridade:'alta',
      itens: [
        'Substitua <code>http://localhost:PORT</code> por caminhos relativos',
        'Use variáveis de ambiente para URLs de API',
        'Crie um arquivo <code>.env</code> com as configurações de ambiente'
      ]
    });
  }

  // chaves expostas
  if (STATE.problems.some(p => p.titulo.includes('chave'))) {
    secoes.push({
      icon:      '🔐',
      titulo:    'Proteger Chaves de API',
      prioridade:'alta',
      itens: [
        'Mova todas as chaves para um arquivo <code>.env</code>',
        'Adicione <code>.env</code> ao <code>.gitignore</code>',
        'Use <code>process.env.NOME_DA_CHAVE</code> no código',
        'Revogue e regenere as chaves que foram expostas'
      ]
    });
  }

  // node_modules
  if (STATE.problems.some(p => p.titulo.includes('node_modules'))) {
    secoes.push({
      icon:      '📦',
      titulo:    'Limpar node_modules do ZIP',
      prioridade:'media',
      itens: [
        'Delete a pasta <code>node_modules</code> antes de zipar',
        'Certifique-se que o <code>package.json</code> está correto',
        'Rode <code>npm install</code> após extrair o projeto',
        'Adicione <code>node_modules/</code> ao <code>.gitignore</code>'
      ]
    });
  }

  // sem index.html
  if (STATE.problems.some(p => p.titulo.includes('index.html'))) {
    secoes.push({
      icon:      '📄',
      titulo:    'Criar Ponto de Entrada',
      prioridade:'alta',
      itens: [
        'Crie um arquivo <code>index.html</code> na raiz do projeto',
        'Certifique-se que ele referencia os arquivos CSS e JS corretamente',
        'Teste abrindo o arquivo diretamente no navegador'
      ]
    });
  }

  // melhorias gerais
  secoes.push({
    icon:      '🚀',
    titulo:    'Melhorias Gerais Recomendadas',
    prioridade:'baixa',
    itens: [
      'Adicione um <code>README.md</code> com instruções de uso',
      'Minifique os arquivos CSS e JS para produção',
      'Adicione tratamento de erros nas chamadas de API',
      'Implemente loading states para melhor experiência do usuário',
      'Teste o projeto em diferentes navegadores',
      'Verifique se todas as CDNs externas têm fallback local'
    ]
  });

  // PWA
  if (STATE.techs.some(t => t.name === 'PWA')) {
    secoes.push({
      icon:      '📱',
      titulo:    'Melhorias de PWA',
      prioridade:'media',
      itens: [
        'Verifique se o <code>manifest.json</code> está completo',
        'Certifique-se que o Service Worker está registrado corretamente',
        'Adicione ícones em todos os tamanhos necessários',
        'Teste o modo offline da aplicação'
      ]
    });
  }

  el.innerHTML = secoes.map(s => `
    <div class="plano-section">
      <div class="plano-header">
        ${s.icon} ${s.titulo}
        <span class="plano-prioridade prior-${s.prioridade}">
          ${s.prioridade.toUpperCase()}
        </span>
      </div>
      <div class="plano-body">
        <ul>
          ${s.itens.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

// ── RELATÓRIO COMPLETO ───────────────────────────────────────
function montarRelatorio() {
  const linhas = [];
  const sep    = '═'.repeat(60);
  const sep2   = '─'.repeat(60);

  linhas.push(sep);
  linhas.push('  RELATÓRIO DE ANÁLISE DE PROJETO');
  linhas.push(`  Gerado em: ${new Date().toLocaleString('pt-BR')}`);
  linhas.push(sep);
  linhas.push('');
  linhas.push('📦 PROJETO: ' + STATE.projectName);
  linhas.push('📁 Arquivos: ' + STATE.files.length);
  linhas.push('⚖️  Tamanho:  ' + fmtSize(STATE.totalSize()));
  linhas.push('📝 Linhas:   ' + STATE.totalLines().toLocaleString());
  linhas.push('');

  linhas.push(sep2);
  linhas.push('🔧 TECNOLOGIAS DETECTADAS');
  linhas.push(sep2);
  if (STATE.techs.length > 0) {
    STATE.techs.forEach(t => linhas.push(`  ${t.icon} ${t.name}`));
  } else {
    linhas.push('  Nenhuma tecnologia detectada');
  }
  linhas.push('');

  if (STATE.deps.length > 0) {
    linhas.push(sep2);
    linhas.push('📦 DEPENDÊNCIAS (' + STATE.deps.length + ')');
    linhas.push(sep2);
    STATE.deps.forEach(d =>
      linhas.push(`  ${d.dev ? '[dev] ' : '      '} ${d.name} ${d.version}`)
    );
    linhas.push('');
  }

  if (STATE.apis.length > 0) {
    linhas.push(sep2);
    linhas.push('🌐 APIs EXTERNAS');
    linhas.push(sep2);
    STATE.apis.forEach(a => linhas.push('  • ' + a));
    linhas.push('');
  }

  linhas.push(sep2);
  linhas.push('⚠️  PROBLEMAS ENCONTRADOS (' + STATE.problems.length + ')');
  linhas.push(sep2);
  if (STATE.problems.length === 0) {
    linhas.push('  ✅ Nenhum problema detectado');
  } else {
    STATE.problems.forEach(p => {
      linhas.push(`  ${p.icon} ${p.titulo}`);
      linhas.push(`     ${p.desc}`);
      if (p.fix) linhas.push(`     💡 ${p.fix}`);
      linhas.push('');
    });
  }

  linhas.push(sep2);
  linhas.push('📁 LISTA DE ARQUIVOS');
  linhas.push(sep2);
  STATE.files.forEach(f =>
    linhas.push(`  ${iconePorTipo(f.type)} ${f.path} (${fmtSize(f.size)})`)
  );
  linhas.push('');
  linhas.push(sep);
  linhas.push('  FIM DO RELATÓRIO');
  linhas.push(sep);

  document.getElementById('reportBox').textContent = linhas.join('\n');
}

// ── ABAS ─────────────────────────────────────────────────────
function iniciarAbas() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });
  switchTab('visao');
}

// ── COPIAR RELATÓRIO ─────────────────────────────────────────
function copiarRelatorio() {
  const texto = document.getElementById('reportBox').textContent;
  navigator.clipboard.writeText(texto).then(() => {
    mostrarToast('📋 Relatório copiado!', 'green');
  }).catch(() => {
    mostrarToast('❌ Erro ao copiar', 'red');
  });
}

function copiarPlano() {
  const el    = document.getElementById('planoConteudo');
  const texto = el.innerText || el.textContent;
  navigator.clipboard.writeText(texto).then(() => {
    mostrarToast('🗺️ Plano copiado!', 'green');
  }).catch(() => {
    mostrarToast('❌ Erro ao copiar', 'red');
  });
}

// ── HELPERS ──────────────────────────────────────────────────
function corPorTipo(ext) {
  const mapa = {
    html: 'red',    htm: 'red',
    css:  'blue',   scss: 'purple', sass: 'purple',
    js:   'yellow', ts:   'blue',   jsx:  'blue', tsx: 'blue',
    json: 'green',  md:   'blue',
    py:   'green',  php:  'purple',
    sql:  'blue',   sh:   'green',
    vue:  'green',  svelte: 'red',
  };
  return mapa[ext] || 'gray';
}

function iconePorTipo(ext) {
  const mapa = {
    html: '🌐', htm:  '🌐',
    css:  '🎨', scss: '🎨', sass: '🎨',
    js:   '📜', ts:   '🔷', jsx:  '⚛️', tsx: '⚛️',
    json: '📋', md:   '📖',
    py:   '🐍', php:  '🐘',
    sql:  '🗄️', sh:   '⚙️',
    vue:  '💚', svelte:'🔥',
    png:  '🖼️', jpg:  '🖼️', jpeg:'🖼️', gif:'🖼️', svg:'🖼️',
    pdf:  '📄', zip:  '🗜️',
    env:  '🔐', gitignore: '🙈',
  };
  return mapa[ext] || '📄';
}

function escapar(str) {
  return str.replace(/'/g, "\\'");
}
