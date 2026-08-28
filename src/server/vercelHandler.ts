import { app } from "./app";

// Vercel Serverless Function entry point
// This is bundled via esbuild into api/index.js for Vercel deployment
export default function handler(req: any, res: any) {
  return app(req, res);
}
