require("dotenv").config();

export const config = {
  port: (process.env.PORT as unknown as number) || 8000,
  dataBase: process.env.DATABASE_URI || "",
  openai: process.env.OPENAI_TOKEN || "",
  apiVersion: process.env.API_VERSION || "1",
  jwtSecret: process.env.ACCESS_TOKEN_SECRET || "",
};
