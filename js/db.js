/* ============================================================
   DB — banco de dados local com Dexie (IndexedDB)
   Salva histórico de projetos analisados
   ============================================================ */

// inicializa banco
const db = new Dexie('DocumentadorDB');

db.version(1).stores({
  projetos: '++id, nome, data, arquivos, relatorio'
});

// ── SALVAR PROJETO ───────────────────────────────────────────
async function dbSalvar() {
  try {
    const dados = {
      nome:      STATE.projectName,
      data:      new Date().toISOString(),
      arquivos:  STATE.files.length,
      tamanho:   STATE.totalSize(),
      linhas:    STATE.totalLines(),
      techs:     STATE.techs.map(t => t.name).join(', '),
      relatorio: document.getElementById('reportBox').textContent || ''
    };

    await db.projetos.add(dados);
    mostrarToast('✅ Projeto salvo no histórico!', 'green');
  } catch (err) {
    mostrarToast('❌ Erro ao salvar: ' + err.message, 'red');
  }
}

// ── CARREGAR HISTÓRICO ───────────────────────────────────────
async function dbCarregarHistorico() {
  try {
    const lista = await db.projetos.orderBy('data').reverse().toArray();
    return lista;
  } catch (err) {
    return [];
  }
}

// ── DELETAR PROJETO ──────────────────────────────────────────
async function dbDeletar(id) {
  try {
    await db.projetos.delete(id);
    mostrarToast('🗑️ Removido do histórico', 'yellow');
    abrirHistorico();
  } catch (err) {
    mostrarToast('❌ Erro ao deletar', 'red');
  }
}

// ── TOAST DE NOTIFICAÇÃO ─────────────────────────────────────
function mostrarToast(msg, cor) {
  // remove toast anterior se existir
  const old = document.getElementById('toast');
  if (old) old.remove();

  const cores = {
    green:  { bg: 'var(--green-bg)',  border: 'var(--green-text)',  color: 'var(--green-text)'  },
    red:    { bg: 'var(--red-bg)',    border: 'var(--red-text)',    color: 'var(--red-text)'    },
    yellow: { bg: 'var(--yellow-bg)', border: 'var(--yellow-text)', color: 'var(--yellow-text)' },
    blue:   { bg: 'var(--blue-bg)',   border: 'var(--blue-text)',   color: 'var(--blue-text)'   },
  };

  const c = cores[cor] || cores.blue;

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = msg;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '24px',
    right:        '24px',
    background:   c.bg,
    border:       `1px solid ${c.border}`,
    color:        c.color,
    padding:      '12px 20px',
    borderRadius: '8px',
    fontWeight:   '600',
    fontSize:     '0.9rem',
    zIndex:       '9999',
    boxShadow:    '0 4px 20px rgba(0,0,0,0.4)',
    animation:    'fadeIn 0.2s ease'
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── ABRIR MODAL HISTÓRICO ────────────────────────────────────
async function abrirHistorico() {
  const lista = await dbCarregarHistorico();
  const el    = document.getElementById('historicoLista');

  if (lista.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:32px;color:var(--text-muted)">
        Nenhum projeto salvo ainda.<br>
        Analise um projeto e clique em
        <strong>💾 Salvar no Histórico</strong>
      </div>`;
  } else {
    el.innerHTML = lista.map(p => `
      <div class="hist-item">
        <div onclick="dbCarregarDoHistorico(${p.id})" style="flex:1;cursor:pointer">
          <div class="hist-name">📦 ${p.nome}</div>
          <div class="hist-date">
            ${new Date(p.data).toLocaleString('pt-BR')} ·
            ${p.arquivos} arquivo(s) ·
            ${fmtSize(p.tamanho)}
          </div>
          <div style="margin-top:4px;font-size:0.78rem;color:var(--text-muted)">
            🔧 ${p.techs || 'sem tecnologias detectadas'}
          </div>
        </div>
        <button class="hist-del"
          onclick="dbDeletar(${p.id})"
          title="Remover do histórico">🗑️</button>
      </div>
    `).join('');
  }

  document.getElementById('modalHistorico').style.display = 'flex';
}

// ── FECHAR MODAL ─────────────────────────────────────────────
function fecharHistorico(event) {
  if (!event || event.target.id === 'modalHistorico') {
    document.getElementById('modalHistorico').style.display = 'none';
  }
}

// ── CARREGAR RELATÓRIO DO HISTÓRICO ─────────────────────────
async function dbCarregarDoHistorico(id) {
  try {
    const p = await db.projetos.get(id);
    if (!p) return;

    fecharHistorico();

    // mostra o relatório salvo
    document.getElementById('resultPanel').style.display  = 'block';
    document.getElementById('projectBadge').textContent   = '📦 ' + p.nome + ' (histórico)';
    document.getElementById('reportBox').textContent      = p.relatorio;

    switchTab('relatorio');
    mostrarToast('📂 Relatório carregado do histórico', 'blue');
  } catch (err) {
    mostrarToast('❌ Erro ao carregar', 'red');
  }
}

// ── SALVAR NO HISTÓRICO (chamado pelo botão) ─────────────────
function salvarNoHistorico() {
  dbSalvar();
}

// ── HELPER TAMANHO (usado aqui e em outros módulos) ──────────
function fmtSize(bytes) {
  if (!bytes || bytes === 0) return '0B';
  if (bytes < 1024)    return bytes + 'B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / 1048576).toFixed(1) + 'MB';
}
