import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password: string;
      confirm_password: string;
    };
    meals: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      be_on_the_diet: boolean;
      created_at?: string;
    };
  }
}
