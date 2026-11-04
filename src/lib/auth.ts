import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  user: {
    modelName: "userTable",
  },
  session: {
    modelName: "sessionTable",
  },
  account: {
    modelName: "accountTable",
  },
  verification: {
    modelName: "verificationTable",
  },
});
