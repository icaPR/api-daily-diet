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

    let user_id = req.cookies.user_id;
    if (!user_id) {
      user_id = randomUUID();

      res.cookie("user_id", user_id, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

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

  app.get("/:id", async (req, res) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getUserParamsSchema.parse(req.params);

    const users = await knex("users").where({ id }).first();
    return { users };
  });

  app.get("/metric", async (req, res) => {
    const user_id = req.cookies.user_id;

    const meals = await knex("meals").orderBy("user_id").orderBy("created_at");

    let longestSequence = 0;
    let currentSequence = 0;
    let currentUser = null;

    for (const meal of meals) {
      if (meal.user_id !== currentUser) {
        currentSequence = 0;
        currentUser = meal.user_id;
      }
      if (meal.be_on_the_diet) {
        currentSequence++;
        longestSequence = Math.max(longestSequence, currentSequence);
      } else {
        currentSequence = 0;
      }
    }

    const metric = {
      totalMeals: await knex("meals").count().first(),
      totalDietMeals: await knex("meals")
        .where({ be_on_the_diet: true, user_id })
        .count()
        .first(),
      totalNoDietMeals: await knex("meals")
        .where({ be_on_the_diet: false, user_id })
        .count()
        .first(),
      bestDietMealsSequence: longestSequence,
    };

    return { metric };
  });
}
