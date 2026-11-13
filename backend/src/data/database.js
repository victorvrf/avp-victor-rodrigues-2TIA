const equipamentos = [
  {
    id: 1,
    nome: "Câmera IP",
    categoria: "Monitoramento",
    fabricante: "Intelbras",
    quantidade: 10,
    status: "disponível",
  },
  {
    id: 2,
    nome: "Roteador",
    categoria: "Rede",
    fabricante: "TP-Link",
    quantidade: 5,
    status: "disponível",
  },
  {
    id: 3,
    nome: "Sensor de Presença",
    categoria: "Segurança",
    fabricante: "Positivo",
    quantidade: 8,
    status: "em manutenção",
  },
];

const usuarios = [];

let proximoEquipamentoId = 4;
let proximoUsuarioId = 1;

function gerarIdEquipamento() {
  return proximoEquipamentoId++;
}

function gerarIdUsuario() {
  return proximoUsuarioId++;
}

export { equipamentos, usuarios, gerarIdEquipamento, gerarIdUsuario };
