/* ============================================================
   STATE — dados globais compartilhados entre todos os módulos
   ============================================================ */

const STATE = {

  // projeto atual carregado
  projectName: '',
  projectDate: null,
  isZip: false,

  // lista de arquivos lidos
  files: [],

  // resultados da análise
  techs:    [],
  deps:     [],
  apis:     [],
  problems: [],
  cdns:     [],

  // arquivo aberto no visualizador
  fileAtual: null,

  // limpa tudo para novo projeto
  reset() {
    this.projectName = '';
    this.projectDate = null;
    this.isZip       = false;
    this.files       = [];
    this.techs       = [];
    this.deps        = [];
    this.apis        = [];
    this.problems    = [];
    this.cdns        = [];
    this.fileAtual   = null;
  },

  // retorna todo o conteúdo junto para buscas
  allContent() {
    return this.files.map(f => f.content || '').join('\n');
  },

  // tamanho total em bytes
  totalSize() {
    return this.files.reduce((a, f) => a + (f.size || 0), 0);
  },

  // total de linhas de código
  totalLines() {
    return this.files.reduce((a, f) => {
      if (f.content && f.content !== '[arquivo binário]') {
        return a + f.content.split('\n').length;
      }
      return a;
    }, 0);
  },

  // busca arquivo pelo caminho
  getFile(path) {
    return this.files.find(f => f.path === path) || null;
  },

  // arquivos por tipo
  byType(ext) {
    if (Array.isArray(ext)) {
      return this.files.filter(f => ext.includes(f.type));
    }
    return this.files.filter(f => f.type === ext);
  }

};
