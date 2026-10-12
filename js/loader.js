/* ============================================================
   LOADER — lê arquivos ZIP e HTML importados pelo usuário
   ============================================================ */

// ── DRAG & DROP ──────────────────────────────────────────────
function dragOver(event) {
  event.preventDefault();
  document.getElementById('dropZone').classList.add('drag-over');
}

function dragLeave(event) {
  event.preventDefault();
  document.getElementById('dropZone').classList.remove('drag-over');
}

function onDrop(event) {
  event.preventDefault();
  document.getElementById('dropZone').classList.remove('drag-over');
  const file = event.dataTransfer.files[0];
  if (file) onFileSelect(file);
}

// ── ENTRADA PRINCIPAL ────────────────────────────────────────
async function onFileSelect(file) {
  if (!file) return;

  const nome = file.name.toLowerCase();
  const valido = nome.endsWith('.zip') ||
                 nome.endsWith('.html') ||
                 nome.endsWith('.htm');

  if (!valido) {
    mostrarToast('❌ Use apenas arquivos .zip ou .html', 'red');
    return;
  }

  // reseta estado anterior
  STATE.reset();
  STATE.projectName = file.name.replace(/\.(zip|html|htm)$/i, '');
  STATE.projectDate = new Date();
  STATE.isZip       = nome.endsWith('.zip');

  // mostra loading
  mostrarLoading('Lendo arquivo...');
  esconderResultado();

  try {
    if (STATE.isZip) {
      await lerZip(file);
    } else {
      await lerHtml(file);
    }

    setMsgLoading('Analisando estrutura...');
    await esperar(200);

    setMsgLoading('Detectando tecnologias...');
    await esperar(200);

    // dispara análise e montagem
    analisarTudo();
    montarTudo();

    esconderLoading();
    mostrarResultado();

    document.getElementById('projectBadge').innerHTML =
      `📦 ${STATE.projectName}
       <span style="font-size:0.8rem;font-weight:400;
       color:var(--text-muted);margin-left:8px">
         ${STATE.files.length} arquivo(s) ·
         ${fmtSize(STATE.totalSize())} ·
         ${STATE.totalLines().toLocaleString()} linhas
       </span>`;

    mostrarToast('✅ Projeto carregado com sucesso!', 'green');

  } catch (err) {
    esconderLoading();
    mostrarToast('❌ Erro ao ler arquivo: ' + err.message, 'red');
    console.error(err);
  }
}

// ── LER ZIP ──────────────────────────────────────────────────
async function lerZip(file) {
  const buffer = await file.arrayBuffer();
  const zip    = await JSZip.loadAsync(buffer);

  STATE.files = [];

  const tarefas = [];

  zip.forEach((caminho, entrada) => {
    if (!entrada.dir) {
      tarefas.push(processarEntrada(caminho, entrada));
    }
  });

  await Promise.all(tarefas);

  // ordena por caminho
  STATE.files.sort((a, b) => a.path.localeCompare(b.path));
}

// ── PROCESSAR ENTRADA DO ZIP ─────────────────────────────────
async function processarEntrada(caminho, entrada) {
  const ext    = obterExt(caminho);
  const binario = ehBinario(ext);

  let conteudo = '[arquivo binário]';

  if (!binario) {
    try {
      conteudo = await entrada.async('string');
    } catch (e) {
      conteudo = '[erro ao ler arquivo]';
    }
  }

  STATE.files.push({
    path:    caminho,
    name:    caminho.split('/').pop(),
    type:    ext,
    size:    conteudo.length,
    content: conteudo,
    binary:  binario
  });
}

// ── LER HTML ÚNICO ───────────────────────────────────────────
async function lerHtml(file) {
  const texto = await file.text();

  STATE.files = [{
    path:    file.name,
    name:    file.name,
    type:    'html',
    size:    texto.length,
    content: texto,
    binary:  false
  }];
}

// ── HELPERS ──────────────────────────────────────────────────
function obterExt(caminho) {
  const partes = caminho.split('.');
  if (partes.length < 2) return 'txt';
  return partes.pop().toLowerCase().split('?')[0];
}

function ehBinario(ext) {
  const binarios = [
    'png','jpg','jpeg','gif','ico','webp','svg',
    'woff','woff2','ttf','eot','otf',
    'pdf','zip','gz','tar','rar',
    'mp3','mp4','wav','ogg','webm',
    'exe','dll','so','bin','dat',
    'DS_Store','map'
  ];
  return binarios.includes(ext);
}

function esperar(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── CONTROLE DE UI ───────────────────────────────────────────
function mostrarLoading(msg) {
  document.getElementById('loadingBar').style.display = 'flex';
  setMsgLoading(msg);
}

function esconderLoading() {
  document.getElementById('loadingBar').style.display = 'none';
}

function setMsgLoading(msg) {
  document.getElementById('loadingMsg').textContent = msg;
}

function mostrarResultado() {
  document.getElementById('resultPanel').style.display = 'block';
}

function esconderResultado() {
  document.getElementById('resultPanel').style.display = 'none';
}

// ── SISTEMA DE ABAS ──────────────────────────────────────────
function switchTab(id) {
  // botões
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === id);
  });

  // painéis
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'tab-' + id);
  });
}
