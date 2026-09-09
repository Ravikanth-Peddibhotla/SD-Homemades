import express, { type Express } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const storefrontDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../homemade-podis-pickles/dist/public");
const hasValidClerkSecret = /^sk_(test|live)_/.test(process.env.CLERK_SECRET_KEY ?? "");
const hasValidClerkPublishable = /^pk_(test|live)_/.test(process.env.CLERK_PUBLISHABLE_KEY ?? "");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (hasValidClerkSecret && hasValidClerkPublishable) {
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
  );
}

app.use("/api", router);

if (process.env.NODE_ENV === "production" || process.env.SERVE_STOREFRONT === "true") {
  app.use(express.static(storefrontDir));
  app.use((request, response, next) => {
    if (request.method === "GET" && !request.path.startsWith("/api")) {
      response.sendFile(path.join(storefrontDir, "index.html"), (error) => error && next(error));
      return;
    }
    next();
  });
}

export default app;
