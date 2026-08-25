class ChunkService {
    chunkText(text: string, chunkSize: number = 400): string[] {
      const sentences = text.split(/(?<=[.!?])\s+/);
  
      const chunks: string[] = [];
      let current = "";
  
      for (const sentence of sentences) {
        if ((current + sentence).length > chunkSize) {
          chunks.push(current.trim());
          current = sentence + " ";
        } else {
          current += sentence + " ";
        }
      }
  
      if (current.trim()) {
        chunks.push(current.trim());
      }
  
      return chunks;
    }
  }
  
  export default new ChunkService();