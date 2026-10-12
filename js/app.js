/* ============================================================
   APP — inicialização geral e eventos globais
   ============================================================ */

// ── INICIALIZAR ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  iniciarEventos();
  verificarLibs();
});

// ── EVENTOS GLOBAIS ──────────────────────────────────────────
function iniciarEventos() {

  // ESC fecha modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      fecharHistorico();
    }
  });

  // clique fora do modal fecha
  document.getElementById('modalHistorico')
    .addEventListener('click', e => {
      if (e.target.id === 'modalHistorico') {
        fecharHistorico();
      }
    });

  // drag and drop na janela toda
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop',     e => e.preventDefault());

  // botões extras do relatório
  adicionarBotoesExtras();
}

// ── BOTÕES EXTRAS NO RELATÓRIO ───────────────────────────────
function adicionarBotoesExtras() {
  const actions = document.querySelector('.report-actions');
  if (!actions) return;

  // botão copiar para IA
  const btnIA = document.createElement('button');
  btnIA.className   = 'btn btn-primary';
  btnIA.innerHTML   = '🤖 Copiar Contexto para IA';
  btnIA.onclick     = copiarParaIA;
  actions.appendChild(btnIA);

  // botão exportar TXT
  const btnTxt = document.createElement('button');
  btnTxt.className  = 'btn btn-ghost';
  btnTxt.innerHTML  = '💾 Exportar .TXT';
  btnTxt.style.background = 'var(--bg-hover)';
  btnTxt.style.color      = 'var(--text-secondary)';
  btnTxt.style.border     = '1px solid var(--border)';
  btnTxt.onclick    = exportarTxt;
  actions.appendChild(btnTxt);
}

// ── VERIFICAR LIBS ───────────────────────────────────────────
function verificarLibs() {
  const erros = [];

  if (typeof JSZip === 'undefined') {
    erros.push('JSZip não carregou — verifique libs/jszip.min.js');
  }
  if (typeof Dexie === 'undefined') {
    erros.push('Dexie não carregou — verifique libs/dexie.min.js');
  }

  if (erros.length > 0) {
    setTimeout(() => {
      erros.forEach(e => mostrarToast('⚠️ ' + e, 'red'));
    }, 800);
  }
}
