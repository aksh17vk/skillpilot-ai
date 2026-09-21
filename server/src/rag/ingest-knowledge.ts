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

  // Embed in GPU batches and insert each batch in one DB write
  const BATCH_SIZE = 32;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    console.log(
      `Embedding chunks ${i + 1}-${i + batch.length}`
    );

    const embeddings = await embedService.embedMany(batch);

    await Knowledge.insertMany(
      batch.map((chunk, j) => ({
        text: chunk,
        skill: "docker",
        type: "concept",
        source: "docker.txt",
        embedding: embeddings[j],
      }))
    );
  }

  console.log("Docker knowledge ingested successfully ");

  process.exit(0);
}

ingest().catch((err) => {
  console.error(err);
  process.exit(1);
});