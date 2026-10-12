/* ============================================================
   REPORT — funções extras de relatório e exportação
   ============================================================ */

// ── GERAR RELATÓRIO PARA IA ──────────────────────────────────
function gerarRelatorioIA() {
  const linhas = [];
  const sep    = '═'.repeat(60);
  const sep2   = '─'.repeat(60);

  linhas.push(sep);
  linhas.push('  CONTEXTO DO PROJETO PARA ANÁLISE COM IA');
  linhas.push(`  Gerado em: ${new Date().toLocaleString('pt-BR')}`);
  linhas.push(sep);
  linhas.push('');
  linhas.push('INSTRUÇÕES PARA A IA:');
  linhas.push('Use este relatório como contexto completo do projeto.');
  linhas.push('Analise os problemas encontrados e sugira correções.');
  linhas.push('');

  linhas.push(sep2);
  linhas.push('INFORMAÇÕES GERAIS');
  linhas.push(sep2);
  linhas.push('Projeto:    ' + STATE.projectName);
  linhas.push('Arquivos:   ' + STATE.files.length);
  linhas.push('Tamanho:    ' + fmtSize(STATE.totalSize()));
  linhas.push('Linhas:     ' + STATE.totalLines().toLocaleString());
  linhas.push('');

  linhas.push(sep2);
  linhas.push('TECNOLOGIAS');
  linhas.push(sep2);
  if (STATE.techs.length > 0) {
    STATE.techs.forEach(t => linhas.push('  • ' + t.name));
  } else {
    linhas.push('  Nenhuma detectada automaticamente');
  }
  linhas.push('');

  if (STATE.deps.length > 0) {
    linhas.push(sep2);
    linhas.push('DEPENDÊNCIAS');
    linhas.push(sep2);
    STATE.deps.slice(0, 30).forEach(d =>
      linhas.push(`  ${d.dev ? '[dev]' : '[dep]'} ${d.name} ${d.version}`)
    );
    if (STATE.deps.length > 30) {
      linhas.push(`  ... e mais ${STATE.deps.length - 30} dependências`);
    }
    linhas.push('');
  }

  linhas.push(sep2);
  linhas.push('PROBLEMAS DETECTADOS');
  linhas.push(sep2);
  if (STATE.problems.length === 0) {
    linhas.push('  Nenhum problema detectado automaticamente');
  } else {
    STATE.problems.forEach(p => {
      linhas.push(`  [${p.tipo.toUpperCase()}] ${p.titulo}`);
      linhas.push(`  Descrição: ${p.desc}`);
      if (p.fix) linhas.push(`  Solução:   ${p.fix}`);
      linhas.push('');
    });
  }

  linhas.push(sep2);
  linhas.push('ESTRUTURA DE ARQUIVOS');
  linhas.push(sep2);
  STATE.files.forEach(f => {
    linhas.push(`  ${f.path} (${fmtSize(f.size)})`);
  });
  linhas.push('');

  // conteúdo dos arquivos de texto pequenos
  const textuais = STATE.files.filter(f =>
    !f.binary &&
    f.size < 50000 &&
    ['html','css','js','ts','json','md','jsx','tsx','vue'].includes(f.type)
  );

  if (textuais.length > 0) {
    linhas.push(sep2);
    linhas.push('CONTEÚDO DOS ARQUIVOS PRINCIPAIS');
    linhas.push(sep2);
    linhas.push('(arquivos de texto até 50KB)');
    linhas.push('');

    textuais.forEach(f => {
      linhas.push(`--- ARQUIVO: ${f.path} ---`);
      linhas.push(f.content || '');
      linhas.push('');
    });
  }

  linhas.push(sep);
  linhas.push('  FIM DO CONTEXTO');
  linhas.push(sep);

  return linhas.join('\n');
}

// ── COPIAR RELATÓRIO PARA IA ─────────────────────────────────
function copiarParaIA() {
  const texto = gerarRelatorioIA();
  navigator.clipboard.writeText(texto)
    .then(() => mostrarToast('🤖 Contexto copiado para a IA!', 'green'))
    .catch(() => mostrarToast('❌ Erro ao copiar', 'red'));
}

// ── EXPORTAR COMO TXT ────────────────────────────────────────
function exportarTxt() {
  const texto    = document.getElementById('reportBox').textContent;
  const blob     = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const url      = URL.createObjectURL(blob);
  const link     = document.createElement('a');
  link.href      = url;
  link.download  = STATE.projectName + '_relatorio.txt';
  link.click();
  URL.revokeObjectURL(url);
  mostrarToast('💾 Relatório exportado!', 'green');
}
