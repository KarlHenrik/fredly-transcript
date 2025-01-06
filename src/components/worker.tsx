import { pipeline, matmul, Tensor } from "@huggingface/transformers";

class MyTranslationPipeline {
  static task = "feature-extraction";
  static model = "Xenova/all-MiniLM-L6-v2";
  static instance = null;
  static embeddings: Tensor | null = null;

  // The model is a static class attribute in order to load lazily and only once
  static async getModel(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (e) => {
  const embedder = await MyTranslationPipeline.getModel((x) => {
    // This callback provides main thread with loading progress messages
    self.postMessage(x);
  });

  const embeddings = await embedder(e.data.text, {
    pooling: "mean",
    normalize: true,
  });

  switch (e.data.action) {
    case "embed":
      // Set internal embeddings!
      MyTranslationPipeline.embeddings = embeddings;
      self.postMessage({
        status: "embedding_complete",
      });
      break;
    case "query": {
      // Compute the cosine similarity between the embedded query and the embedded cells
      const similarities = await matmul(
        MyTranslationPipeline.embeddings,
        embeddings.flatten()
      );
      // Send back the vector of similarities in a nice format [s0, s1, s2, ...]
      self.postMessage({
        status: "query_complete",
        action: e.data.action,
        result: JSON.stringify(Object.values(similarities.ort_tensor.cpuData)),
      });
      break;
    }
  }
});
