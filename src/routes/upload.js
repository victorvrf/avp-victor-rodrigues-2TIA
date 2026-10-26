// ============================================================
// ROTA DE UPLOAD DE IMAGEM (AV2)
// ============================================================
// Envia uma imagem para a pasta local "src/uploads/".
// A validação de TIPO e TAMANHO do arquivo fica no middleware
// src/middlewares/upload.js.
//
// Montado em: /upload  (veja server.js)
// ============================================================

const express = require('express');
const { autenticar } = require('../middlewares/autenticar');
const { uploadImagem } = require('../middlewares/upload');

const router = express.Router();

/**
 * POST /upload
 * Recebe um arquivo de imagem (campo "imagem") e o salva em uploads/.
 * Exige token. Aceita apenas imagens de até 5 MB.
 */
router.post('/', autenticar, uploadImagem, (req, res) => {
  return res.status(201).json({
    mensagem: 'Imagem enviada com sucesso.',
    caminhoArquivo: req.file.path,
    nomeArquivo: req.file.filename,
    tamanhoBytes: req.file.size
  });
});

module.exports = router;
