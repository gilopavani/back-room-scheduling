import express from "express";
import cors from "cors";
import config from "./config/config";
import { sequelize, testConnection, syncDatabase } from "./database";
// import routes from "./routes";
// import morgan from "morgan";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// app.use(morgan("dev")); // log das requisições (útil para testes)

// Rotas principais
// app.use("/api", routes);
app.use("/check", (req, res) => {
  res.status(200).json({ message: "Servidor está funcionando!" });
});

// Testa conexão com o banco e inicia o servidor
const startServer = async () => {
  try {
    await testConnection();
    await syncDatabase(); // use syncDatabase(true) para recriar as tabelas

    app.listen(config.port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${config.port}`);
      console.log(`🌍 Ambiente: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error("🔴 Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
