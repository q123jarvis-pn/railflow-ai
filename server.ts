import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { app } from "./src/server/app";

async function startServer() {
  const PORT = 3000;

  // -------------------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RailFlow AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start RailFlow AI Server:", err);
  process.exit(1);
});
