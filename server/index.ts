import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  let server;
  
  try {
    console.log("Starting server initialization...");
    
    console.log("Registering routes and initializing local storage...");
    server = await registerRoutes(app);
    console.log("Routes registered successfully!");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error(`Server error (${status}):`, err);
      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 3000;
    // app.listen(3000, '127.0.0.1', () => {
    //   console.log('Server running on http://127.0.0.1:3000');
    // });
    
    // server.listen({
    //   port: 3000,
    //   host: "localhost",
    //   reusePort: true,
    // }, () => {
    //   log(`serving on port ${port}`);
    // });
    app.listen(port, '127.0.0.1', () => {
      console.log(`Server running on http://127.0.0.1:${port}`);
      log(`serving on port ${port}`);
    });
    
  } catch (error) {
    console.error("CRITICAL SERVER INITIALIZATION ERROR:", error);
    process.exit(1);
  }
})();
