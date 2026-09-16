// ============================================================
// BANCO DE DADOS EM MEMÓRIA
// ============================================================
// Simula um banco de dados usando listas de objetos em memória
// JavaScript (exigência da AV1/AV2: sem banco de dados real).
//
// IMPORTANTE: os dados existem SOMENTE enquanto o servidor
// estiver em execução. Ao reiniciar, tudo volta ao estado
// inicial definido aqui.
//
// Este arquivo é compartilhado por todas as rotas (src/routes).
// ============================================================

// ------------------------------------------------------------
// EQUIPAMENTOS (AV1) — já inicia com alguns cadastrados
// ------------------------------------------------------------
const equipamentos = [
  {
    id: 1,
    nome: 'Câmera IP',
    categoria: 'Monitoramento',
    fabricante: 'Intelbras',
    quantidade: 10,
    status: 'disponível'
  },
  {
    id: 2,
    nome: 'Roteador',
    categoria: 'Rede',
    fabricante: 'TP-Link',
    quantidade: 5,
    status: 'disponível'
  },
  {
    id: 3,
    nome: 'Sensor de Presença',
    categoria: 'Segurança',
    fabricante: 'Positivo',
    quantidade: 8,
    status: 'em manutenção'
  }
];

// ------------------------------------------------------------
// USUÁRIOS (AV2) — a senha é guardada JÁ CRIPTOGRAFADA (bcrypt)
// ------------------------------------------------------------
const usuarios = [];

// ------------------------------------------------------------
// GERADORES DE ID ÚNICO (exigência da AV1)
// ------------------------------------------------------------
let proximoEquipamentoId = 4;
let proximoUsuarioId = 1;

/**
 * Gera um ID único para um novo equipamento.
 */
function gerarIdEquipamento() {
  return proximoEquipamentoId++;
}

/**
 * Gera um ID único para um novo usuário.
 */
function gerarIdUsuario() {
  return proximoUsuarioId++;
}

module.exports = {
  equipamentos,
  usuarios,
  gerarIdEquipamento,
  gerarIdUsuario
};
