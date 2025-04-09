import { XLMRobertaModel, AutoTokenizer, matmul, PreTrainedModel, Tokenizer, ProgressCallback, Tensor } from "@huggingface/transformers";


class MyTranslationPipeline {
  static task = "retrieval.passage" //"feature-extraction";
  static model_id = 'jinaai/jina-reranker-v2-base-multilingual';
  static processor: Tokenizer | null = null
  static model: PreTrainedModel | null = null;
  static embeddings: Tensor | null = null;

  // The model is a static class attribute in order to load lazily and only once
  static async getModel(progress_callback: ProgressCallback) {
    if (this.model === null) {
      this.model = await XLMRobertaModel.from_pretrained(this.model_id, { dtype: "fp16" /* e.g., "fp16", "q8", or "q4" */ , progress_callback });
      this.tokenizer = await AutoTokenizer.from_pretrained(this.model_id)
    }
    return { model: this.model, tokenizer: this.tokenizer }; 
  }
}

self.addEventListener("message", async (e) => {
  const { model, tokenizer } = await MyTranslationPipeline.getModel((x) => {
    // This callback provides main thread with loading progress messages
    self.postMessage(x);
  });

  switch (e.data.action) {
    case "embed": {
      const inputs = await processor(e.data.text.splice(0, 1), { padding: true, truncation: true });
      const { embeddings } = await model(inputs);
      // Set internal embeddings!
      MyTranslationPipeline.embeddings = embeddings;
      self.postMessage({
        status: "embedding_complete",
      });
      break;
     }
    case "query": {
      const query_prefix = "Represent the query for retrieving evidence documents: ";
      const query_inputs = await processor(query_prefix + e.data.text, { padding: true, truncation: true });
      const { query_embedding } = await model(query_inputs);
      
      // Compute the cosine similarity between the embedded query and the embedded cells
      const similarities = await matmul(MyTranslationPipeline.embeddings, query_embedding.flatten());

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
