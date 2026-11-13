import express from "express";
import autenticar from "../middlewares/autenticar.js";
import { uploadImagem } from "../middlewares/upload.js";

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Envia uma imagem
 *     description: Recebe um arquivo de imagem (campo "imagem") e o salva em uploads/. Exige token Bearer. Aceita apenas imagens de até 5 MB.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagem:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem a ser enviado
 *     responses:
 *       201:
 *         description: Imagem enviada com sucesso.
 *       400:
 *         description: Arquivo inválido ou muito grande.
 *       401:
 *         description: Token ausente ou inválido.
 */

router.post("/", autenticar, uploadImagem, (req, res) => {
  return res.status(201).json({
    mensagem: "Imagem enviada com sucesso.",
    caminhoArquivo: req.file.path,
    nomeArquivo: req.file.filename,
    tamanhoBytes: req.file.size,
  });
});

export default router;
