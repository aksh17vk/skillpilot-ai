import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { warmupOllama } from "./ai/ollama.client.js";

const startServer = async () => {
  try {
    await connectDB();

    const port = Number(env.PORT) || 5000;
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);

      // Preload models into GPU memory in the background
      void warmupOllama();
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Please stop the process using it or set a different PORT in your .env file.`);
        process.exit(1);
      }

      console.error(error);
      process.exit(1);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();