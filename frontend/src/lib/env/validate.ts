import nextEnv from "@next/env";
import { envServerSchema, envClientSchema } from "./schemas";

nextEnv.loadEnvConfig(process.cwd(), true);

console.log("Validating environment variables...");
envServerSchema.parse(process.env);
envClientSchema.parse(process.env);
console.log("Environment variables validated successfully.");
