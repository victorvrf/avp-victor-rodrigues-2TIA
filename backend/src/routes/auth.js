import express from "express";
import autenticar from "../middlewares/autenticar.js";
import { entrar } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Faz login e retorna um token JWT
 *     description: Recebe email e senha e, se corretos, devolve um token JWT (crachá digital).
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: carlos@email.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso. Retorna o token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 mensagem: Login realizado com sucesso.
 *                 token: eyJhbGciOiJIUzI1NiIs...
 *                 usuario:
 *                   id: 1
 *                   nome: Carlos Silva
 *                   email: carlos@email.com
 *       400:
 *         description: E-mail e senha são obrigatórios.
 *       401:
 *         description: E-mail ou senha incorretos.
 */
router.post("/", entrar);

export default router;
