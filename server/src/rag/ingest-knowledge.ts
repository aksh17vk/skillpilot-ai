import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";

import { connectDB } from "../config/db.js";
import chunkService from "./chunk.service.js";
import embedService from "./embed.service.js";
import Knowledge from "../models/knowledge.model.js";

async function ingest() {
  await connectDB();

  const filePath = path.join(
    process.cwd(),
    "src",
    "knowledge",
    "docker.txt"
  );

  const text = fs.readFileSync(filePath, "utf-8");

  const chunks = chunkService.chunkText(text);

  console.log(`Total chunks: ${chunks.length}`);

  // Remove old docker knowledge
  await Knowledge.deleteMany({ skill: "docker" });

  for (const chunk of chunks) {
    console.log("Embedding chunk:", chunk.slice(0, 50));

    const embedding = await embedService.embedText(chunk);

    await Knowledge.create({
      text: chunk,
      skill: "docker",
      type: "concept",
      source: "docker.txt",
      embedding,
    });
  }

  console.log("Docker knowledge ingested successfully ");

  process.exit(0);
}

ingest().catch((err) => {
  console.error(err);
  process.exit(1);
});