import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo-av2-desenvolvimento-web";

export default function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;
  const token = cabecalho && cabecalho.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      erro: "Acesso negado. Informe um token no cabeçalho Authorization.",
    });
  }

  try {
    const usuario = jwt.verify(token, JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(401).json({
      erro: "Token inválido ou expirado.",
    });
  }
}

export { JWT_SECRET };