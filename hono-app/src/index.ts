import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.use("*", corsMiddleware());

app.get("/message", (c) => {


  return c.text("Hello Hono!");
});

export default app;
