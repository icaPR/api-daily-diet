import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function meals(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const createMealBodyScheme = z.object({
      name: z.string(),
      description: z.string(),
      be_on_the_diet: z.boolean(),
    });

    const body = createMealBodyScheme.parse(req.body);

    let user_id = req.cookies.user_id;

    await knex("meals").insert({
      id: randomUUID(),
      user_id,
      name: body.name,
      description: body.description,
      be_on_the_diet: body.be_on_the_diet,
    });
    return res.status(201).send();
  });

  app.get("/all", async (req, res) => {
    const user_id = req.cookies.user_id;

    const meals = await knex("meals").where("user_id", user_id);

    return { meals };
  });

  app.get("/:id", async (req, res) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { user_id } = req.cookies;

    const { id } = getUserParamsSchema.parse(req.params);

    const meal = await knex("meals").where({ user_id, id }).first();
    return { meal };
  });

  app.put("/:id", async (req, res) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const createMealBodyScheme = z.object({
      name: z.string(),
      description: z.string(),
      be_on_the_diet: z.boolean(),
      created_at: z.string(),
    });

    const body = createMealBodyScheme.parse(req.body);
    const { user_id } = req.cookies;
    const newMeal = {
      name: body.name,
      description: body.description,
      created_at: body.created_at,
      be_on_the_diet: body.be_on_the_diet,
    };

    const { id } = getUserParamsSchema.parse(req.params);

    const meal = await knex("meals")
      .where({ user_id, id })
      .first()
      .update(newMeal);

    return { meal };
  });

  app.delete("/:id", async (req, res) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getUserParamsSchema.parse(req.params);
    const { user_id } = req.cookies;

    const meal = await knex("meals").where({ user_id, id }).first().del();

    return { meal };
  });
}
