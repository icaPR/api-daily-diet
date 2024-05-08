import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function users(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const createUserBodyScheme = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      confirm_password: z.string(),
    });

    const body = createUserBodyScheme.parse(req.body);

    await knex("users").insert({
      id: randomUUID(),
      name: body.name,
      email: body.email,
      password: body.password,
      confirm_password: body.confirm_password,
    });
    return res.status(201).send();
  });

  app.get("/", async (req, res) => {
    const users = await knex("users").select();
    return { users };
  });
}
