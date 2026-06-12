/**
 * proto-paths.ts
 * Caminhos file:// dos protótipos em new-prots/ (referência visual do redesign 2026).
 */
import path from 'path';

const NEW_PROTS_DIR = path.resolve(__dirname, '../../../new-prots');

function fileUrl(filename: string): string {
  const absolute = path.join(NEW_PROTS_DIR, filename);
  return `file://${absolute.replace(/\\/g, '/').replace(/ /g, '%20')}`;
}

export const PROTO_URLS = {
  home: fileUrl('Home (standalone).html'),
  post: fileUrl('Pagina de Postagem (standalone).html'),
  artigos: fileUrl('Artigos (standalone).html'),
  sobre: fileUrl('Sobre (standalone).html'),
  servicos: fileUrl('Serviços (standalone).html'),
  projeto: fileUrl('O Projeto - Marcelo Gonçalves.html'),
  notFound: fileUrl('404 - Marcelo Gonçalves.html'),
} as const;
