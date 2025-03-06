// import { MLCEngineWorkerHandler, MLCEngine } from "https://esm.run/@mlc-ai/web-llm"; antes
import { WebWorkerMLCEngineHandler, MLCEngine } from "https://esm.run/@mlc-ai/web-llm"; // por el momento

const engine = new MLCEngine();
const handler = new WebWorkerMLCEngineHandler(engine)

onmessage = msg => {
    handler.onmessage(msg)
}