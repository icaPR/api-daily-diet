import fastify from "fastify";
import cookie from "@fastify/cookie";
import { meals } from "./routes/meals";
import { users } from "./routes/users";

export const app = fastify();
app.register(cookie);

app.register(users, { prefix: "users" });
app.register(meals, { prefix: "meals" });
