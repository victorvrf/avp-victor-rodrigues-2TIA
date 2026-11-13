import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./src/config/swagger.js";
import prisma from "./src/config/prisma.js";

import rotasEquipamentos from "./src/routes/equipamentos.js";
import rotasUsuarios from "./src/routes/usuarios.js";
import rotasAuth from "./src/routes/auth.js";
import rotasUpload from "./src/routes/upload.js";

const app = express();
const port = process.env.PORT || 3000;

const link = `http://localhost:${port}`;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    projeto: "Sistema de Gerenciamento de Equipamentos de Segurança",
    disciplina: "Desenvolvimento de Websites",
    documentacao: "/api-docs",
  });
});

app.use("/usuarios", rotasUsuarios);
app.use("/auth", rotasAuth);
app.use("/upload", rotasUpload);
app.use("/equipamentos", rotasEquipamentos);

app.use((req, res) => {
  res.status(404).json({
    erro: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição." });
  }
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

try {
  await prisma.$connect();

  console.log("Banco de dados conectado!");
  app.listen(port, () => {
    console.log(`Servidor online em ${link}`);
    console.log(`Swagger: ${link}/api-docs`);
  });
} catch (e) {
  console.error("[ERRO]: Não foi possível se conectar ao banco: ", e.message);

  await prisma.$disconnect();

  process.exitCode = -1;
}