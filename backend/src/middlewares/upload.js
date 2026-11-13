import multer from "multer";
import fs from "fs";
import path from "path";

// Caminho da pasta onde as imagens serão salvas (src/uploads/)
const pastaUpload = path.join(process.cwd(), "src", "uploads");

// Cria a pasta uploads/ caso ela ainda não exista
if (!fs.existsSync(pastaUpload)) {
  fs.mkdirSync(pastaUpload, { recursive: true });
}

// Define onde e com que nome o arquivo será salvo
const armazenamento = multer.diskStorage({
  destination: (req, file, cb) => cb(null, pastaUpload),
  filename: (req, file, cb) => {
    const nomeLimpo = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + nomeLimpo);
  },
});

// Configura o Multer com limite de tamanho (5 MB) e filtro de tipo
const uploadMulter = multer({
  storage: armazenamento,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5 megabytes
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato de arquivo inválido. Envie apenas imagens: JPEG, PNG, GIF, WebP ou BMP."));
    }
  },
});

export function uploadImagem(req, res, next) {
  uploadMulter.single("imagem")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ erro: "Arquivo muito grande. O limite máximo é 5 MB." });
      }
      return res.status(400).json({ erro: err.message });
    }

    if (!req.file) {
      return res.status(400).json({
        erro: 'Nenhum arquivo enviado. Use o campo "imagem" com multipart/form-data.',
      });
    }

    next();
  });
}

export { pastaUpload };
