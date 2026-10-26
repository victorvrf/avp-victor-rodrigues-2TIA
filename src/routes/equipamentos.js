import express from "express";
import autenticar from "../middlewares/autenticar.js";
import {
  criar,
  listar,
  buscarPorId,
  atualizar,
  remover,
} from "../controllers/equipamentosController.js";

const router = express.Router();

/**
 * @swagger
 * /equipamentos:
 *   get:
 *     summary: Lista todos os equipamentos
 *     description: Retorna todos os equipamentos cadastrados. Exige token Bearer.
 *     tags:
 *       - Equipamentos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipamentos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Token ausente ou inválido.
 */

/**
 * @swagger
 * /equipamentos:
 *   post:
 *     summary: Cadastra um novo equipamento
 *     description: Adiciona um equipamento de segurança ao sistema. Exige token Bearer.
 *     tags:
 *       - Equipamentos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, categoria, fabricante, quantidade]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Câmera IP
 *               categoria:
 *                 type: string
 *                 example: Monitoramento
 *               fabricante:
 *                 type: string
 *                 example: Intelbras
 *               quantidade:
 *                 type: integer
 *                 example: 10
 *               status:
 *                 type: string
 *                 example: disponível
 *     responses:
 *       201:
 *         description: Equipamento cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 */

/**
 * @swagger
 * /equipamentos/{id}:
 *   get:
 *     summary: Busca um equipamento pelo ID
 *     description: Retorna os dados de um equipamento específico. Exige token Bearer.
 *     tags:
 *       - Equipamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do equipamento.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Equipamento encontrado.
 *       404:
 *         description: Equipamento não encontrado.
 *       401:
 *         description: Token ausente ou inválido.
 */

/**
 * @swagger
 * /equipamentos/{id}:
 *   put:
 *     summary: Atualiza um equipamento existente
 *     description: Altera os dados de um equipamento. Exige token Bearer.
 *     tags:
 *       - Equipamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do equipamento.
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               categoria:
 *                 type: string
 *               fabricante:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipamento atualizado com sucesso.
 *       404:
 *         description: Equipamento não encontrado.
 *       401:
 *         description: Token ausente ou inválido.
 */

/**
 * @swagger
 * /equipamentos/{id}:
 *   delete:
 *     summary: Exclui um equipamento
 *     description: Remove um equipamento do sistema. Exige token Bearer.
 *     tags:
 *       - Equipamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do equipamento.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Equipamento removido com sucesso.
 *       404:
 *         description: Equipamento não encontrado.
 *       401:
 *         description: Token ausente ou inválido.
 */

router.get("/", autenticar, listar);
router.post("/", autenticar, criar);
router.get("/:id", autenticar, buscarPorId);
router.put("/:id", autenticar, atualizar);
router.delete("/:id", autenticar, remover);

export default router;
