import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../lib/prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:7001",
    "https://sicontrola.com.br",
    "https://api.sicontrola.com.br",
    "https://sicontrola.lofivora.space"
  ],
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "ALUNO",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});

