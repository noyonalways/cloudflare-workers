import type { Context } from "hono";
import { ConflictError, NotFoundError } from "../errors/http.error";
import { UserService } from "../service/user.service";
import type { CreateUserInput, UpdateUserInput } from "../types/user";

type AppEnv = {
  Bindings: CloudflareBindings;
};

type AppContext = Context<AppEnv>;

function getUserService(c: AppContext): UserService {
  return new UserService(c.env.USER_DB);
}

export const userController = {
  async list(c: AppContext) {
    const users = await getUserService(c).list();
    return c.json({ users });
  },

  async getById(c: AppContext, id: number) {
    try {
      const user = await getUserService(c).getById(id);
      return c.json({ user });
    } catch (error) {
      return mapError(c, error);
    }
  },

  async create(c: AppContext, input: CreateUserInput) {
    try {
      const user = await getUserService(c).create(input);
      return c.json({ user }, 201);
    } catch (error) {
      return mapError(c, error);
    }
  },

  async update(c: AppContext, id: number, input: UpdateUserInput) {
    try {
      const user = await getUserService(c).update(id, input);
      return c.json({ user });
    } catch (error) {
      return mapError(c, error);
    }
  },

  async remove(c: AppContext, id: number) {
    try {
      await getUserService(c).delete(id);
      return c.json({ message: "User deleted" });
    } catch (error) {
      return mapError(c, error);
    }
  },
};

function mapError(c: AppContext, error: unknown) {
  if (error instanceof NotFoundError) {
    return c.json({ error: error.message }, 404);
  }

  if (error instanceof ConflictError) {
    return c.json({ error: error.message }, 409);
  }

  throw error;
}
