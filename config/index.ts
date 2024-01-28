require("dotenv").config();

export const config = {
  port: (process.env.PORT as unknown as number) || 8000,
  dataBase: process.env.DATABASE_URI || "",
};
