import { Sequelize } from "sequelize";
import config from "../config/config";

export const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("🟢 Conectado ao banco de dados com sucesso.");
  } catch (error) {
    console.error("🔴 Erro ao conectar no banco:", error);
    throw error;
  }
};

export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log("🟢 Banco de dados sincronizado.");
  } catch (error) {
    console.error("🔴 Erro ao sincronizar banco:", error);
    throw error;
  }
};
