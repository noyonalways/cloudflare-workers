import { Hono } from "hono";
import { corsMiddleware } from "./middlewares";

const app = new Hono<{ Bindings: CloudflareBindings }>();


// CORS middleware
app.use("*", corsMiddleware());


// Health check route
app.get("/health", (c) => {
  return c.json({ message: "OK" });
});

export default app;
