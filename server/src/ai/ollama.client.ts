import { Ollama } from "ollama";

export const CHAT_MODEL =
  process.env.OLLAMA_MODEL || "llama3.2:3b";

export const EMBED_MODEL =
  process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

// How long Ollama keeps the model in VRAM after a request.
// The default (5m) causes a ~30s cold reload after every idle period.
export const KEEP_ALIVE =
  process.env.OLLAMA_KEEP_ALIVE || "30m";

export const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "http://127.0.0.1:11434",
});

// Options shared by EVERY generation call.
// num_ctx / num_gpu must be identical across calls, otherwise Ollama
// unloads and reloads the model each time they change.
const BASE_OPTIONS = {
  // Offload all layers to the GPU (99 = "as many as the model has")
  num_gpu: Number(process.env.OLLAMA_NUM_GPU ?? 99),
  num_ctx: Number(process.env.OLLAMA_NUM_CTX ?? 4096),
};

export function modelOptions(
  overrides: {
    temperature?: number;
    num_predict?: number;
  } = {}
) {
  return { ...BASE_OPTIONS, ...overrides };
}

// Keep prompts inside the context window (~4 chars per token) so
// prompt processing stays fast and the output is never crowded out.
export function clampText(text: string, maxChars: number) {
  const normalized = text.replace(/\s+/g, " ").trim();

  return normalized.length > maxChars
    ? normalized.slice(0, maxChars)
    : normalized;
}

// Load both models into VRAM at startup so the first user
// request does not pay the cold-load cost.
export async function warmupOllama() {
  const started = Date.now();

  try {
    await Promise.all([
      ollama.generate({
        model: CHAT_MODEL,
        prompt: "",
        keep_alive: KEEP_ALIVE,
        options: modelOptions(),
      }),
      ollama.embed({
        model: EMBED_MODEL,
        input: "warmup",
        keep_alive: KEEP_ALIVE,
      }),
    ]);

    const { models } = await ollama.ps();

    for (const m of models) {
      const gpuPercent = m.size
        ? Math.round((m.size_vram / m.size) * 100)
        : 0;

      console.log(
        `Ollama model ready: ${m.name} (${gpuPercent}% GPU)`
      );

      if (gpuPercent < 100) {
        console.warn(
          `${m.name} is partially on CPU - free up VRAM or lower OLLAMA_NUM_CTX for full GPU speed.`
        );
      }
    }

    console.log(
      `Ollama warmup finished in ${Date.now() - started}ms`
    );
  } catch (error) {
    console.warn(
      "Ollama warmup failed (is Ollama running?):",
      error instanceof Error ? error.message : error
    );
  }
}
