/* ============================================================
   VIEWER — visualiza o conteúdo dos arquivos com destaque
   ============================================================ */

// ── ABRIR ARQUIVO ────────────────────────────────────────────
function abrirArquivo(path) {
  const arquivo = STATE.getFile(path);
  if (!arquivo) {
    mostrarToast('❌ Arquivo não encontrado', 'red');
    return;
  }

  STATE.fileAtual = arquivo;
  switchTab('codigo');
  renderViewer(arquivo);
}

// ── RENDERIZAR VIEWER ────────────────────────────────────────
function renderViewer(arquivo) {
  const el = document.getElementById('viewerContent');

  if (arquivo.binary) {
    el.innerHTML = `
      <div class="code-viewer">
        <div class="code-header">
          <div class="code-header-left">
            ${iconePorTipo(arquivo.type)} ${arquivo.path}
          </div>
          <div class="code-header-right">
            <span class="badge badge-gray">arquivo binário</span>
          </div>
        </div>
        <div style="padding:40px;text-align:center;
        color:var(--text-muted)">
          <div style="font-size:3rem;margin-bottom:12px">
            ${iconePorTipo(arquivo.type)}
          </div>
          <div>Este é um arquivo binário e não pode ser exibido como texto.</div>
          <div style="margin-top:8px;font-size:0.85rem">
            Tamanho: ${fmtSize(arquivo.size)}
          </div>
        </div>
      </div>`;
    return;
  }

  const linhas    = (arquivo.content || '').split('\n');
  const totalLin  = linhas.length;
  const cor       = corPorTipo(arquivo.type);
  const conteudo  = escaparHtml(arquivo.content || '');

  el.innerHTML = `
    <div class="code-viewer">
      <div class="code-header">
        <div class="code-header-left">
          ${iconePorTipo(arquivo.type)} ${arquivo.path}
        </div>
        <div class="code-header-right">
          <span class="badge badge-${cor}">.${arquivo.type}</span>
          <span class="badge badge-gray">${totalLin} linhas</span>
          <span class="badge badge-gray">${fmtSize(arquivo.size)}</span>
          <button class="btn btn-sm btn-primary"
            onclick="copiarCodigo()">
            📋 Copiar
          </button>
        </div>
      </div>
      <div class="code-body" id="codeBody">${conteudo}</div>
    </div>`;
}

// ── COPIAR CÓDIGO ────────────────────────────────────────────
function copiarCodigo() {
  if (!STATE.fileAtual) return;
  navigator.clipboard.writeText(STATE.fileAtual.content || '')
    .then(() => mostrarToast('📋 Código copiado!', 'green'))
    .catch(() => mostrarToast('❌ Erro ao copiar', 'red'));
}

// ── ESCAPAR HTML ─────────────────────────────────────────────
function escaparHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
