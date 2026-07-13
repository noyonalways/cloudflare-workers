import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { userController } from "../controller";
import {
  createUserSchema,
  idParamSchema,
  updateUserSchema,
} from "../schemas/user.schema";

const userRoutes = new Hono<{ Bindings: CloudflareBindings }>();

userRoutes.get("/", (c) => userController.list(c));

userRoutes.get("/:id", zValidator("param", idParamSchema), (c) => {
  const { id } = c.req.valid("param");
  return userController.getById(c, id);
});

userRoutes.post("/", zValidator("json", createUserSchema), (c) => {
  const body = c.req.valid("json");
  return userController.create(c, body);
});

userRoutes.put(
  "/:id",
  zValidator("param", idParamSchema),
  zValidator("json", updateUserSchema),
  (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    return userController.update(c, id, body);
  }
);

userRoutes.delete("/:id", zValidator("param", idParamSchema), (c) => {
  const { id } = c.req.valid("param");
  return userController.remove(c, id);
});

export { userRoutes };
