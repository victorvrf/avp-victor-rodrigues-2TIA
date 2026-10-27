import express from "express";
import "dotenv/config";
import prisma from "./src/config/prisma.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./src/config/swagger.js";
import rotasEquipamentos from "./src/routes/equipamentos.js";
import rotasUsuarios from "./src/routes/usuarios.js";
import rotasAuth from "./src/routes/auth.js";
import rotasUpload from "./src/routes/upload.js";

const app = express();
const PORT = process.env.PORT || 3000;

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

async function iniciarServidor() {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
    await prisma.$disconnect();
    process.exitCode = -1;
  }
}

iniciarServidor();