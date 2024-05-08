import fastify from "fastify";
import { user } from "./routes/users";

export const app = fastify();

app.register(user, { prefix: "users" });
