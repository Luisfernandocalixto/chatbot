// import { MLCEngineWorkerHandler, MLCEngine } from "https://esm.run/@mlc-ai/web-llm"; before
import { WebWorkerMLCEngineHandler, MLCEngine } from "https://esm.run/@mlc-ai/web-llm"; // for the time being

const engine = new MLCEngine();
const handler = new WebWorkerMLCEngineHandler(engine);

onmessage = msg => {
    handler.onmessage(msg);
}