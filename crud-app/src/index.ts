import { Hono } from "hono";
import { corsMiddleware } from "./middlewares";
import { userRoutes } from "./routes";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// CORS middleware
app.use("*", corsMiddleware());

// Health check route
app.get("/health", (c) => {
  return c.json({ message: "OK" });
});

// User CRUD routes
app.route("/users", userRoutes);

export default app;
