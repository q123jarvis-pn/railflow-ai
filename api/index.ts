import { app } from "../src/server/app";

// Vercel Serverless Function entry point
// Bridges Vercel serverless incoming HTTP requests directly into the Express application
export default function handler(req: any, res: any) {
  return app(req, res);
}
