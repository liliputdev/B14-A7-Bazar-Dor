
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

function createAuth() {
  const mongoUri = process.env.MONGODB_URI;
  const authSecret = process.env.BETTER_AUTH_SECRET;

  if (!mongoUri?.match(/^mongodb(\+srv)?:\/\//)) {
    throw new Error("Invalid MONGODB_URI. Configure it in the server environment.");
  }

  if (!authSecret || authSecret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters.");
  }

  const client = new MongoClient(mongoUri);
  const db = client.db("bazardor");

  return betterAuth({
    secret: authSecret,
    baseURL: process.env.BETTER_AUTH_URL,

    database: mongodbAdapter(db, {
      client,
    }),

    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
  });
}

let authInstance: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  if (!authInstance) {
    authInstance = createAuth();
  }

  return authInstance;
}
