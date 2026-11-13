import express from "express";
import autenticar from "../middlewares/autenticar.js";
import { criar, listar } from "../controllers/usuariosController.js";

const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Recebe nome, email e senha. A senha é criptografada com bcrypt.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Carlos Silva
 *               email:
 *                 type: string
 *                 example: carlos@email.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso (sem expor a senha).
 *       400:
 *         description: Dados obrigatórios faltando ou inválidos.
 *       409:
 *         description: E-mail já cadastrado.
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna os usuários cadastrados sem expor a senha. Exige token Bearer.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 */

router.post("/", criar);
router.get("/", autenticar, listar);

export default router;
