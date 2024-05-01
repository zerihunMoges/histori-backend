require("dotenv").config();

export const config = {
  port: (process.env.PORT as unknown as number) || 8000,
  env: process.env.NODE_ENV,
  db: {
    remote: process.env.DATABASE_URI || "",
  },
  openai: process.env.OPENAI_TOKEN || "",
  apiVersion: process.env.API_VERSION || "1",
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET || "",
    expiresIn: process.env.JWT_EXPIRESIN,
  },
};
