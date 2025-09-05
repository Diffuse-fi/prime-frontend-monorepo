import "server-only";
import { envServerSchema } from "./schemas";

envServerSchema.parse(process.env);
