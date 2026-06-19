import { LogPanel } from "./components/LogPanel";
import { useLogStore } from "./store/logStore";
import { GeminiService } from "gemini-service";
import { globalLogger } from "shared";
import { ResearchAgent, PedagogyAgent } from "pipeline";

function App() {
  const { addLog } = useLogStore();

  const handleTestLog = () => {
    addLog({
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      level: "INFO",
      source: "ReactApp",
      message: "Test log message from App component",
      metadata: { action: "button_click" },
    });
  };

  const testPhase3Pipeline = async () => {
    globalLogger.info("ReactApp", "Starting Phase 3 Pipeline Test...");
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY");

      const researchAgent = new ResearchAgent(apiKey);
      const pedagogyAgent = new PedagogyAgent(apiKey);

      const topic = "Pythagorean Theorem";
      const audienceLevel = "high_school";

      globalLogger.info("ReactApp", `Running ResearchAgent on topic: ${topic}`);
      const research = await researchAgent.execute({ topic, audienceLevel });

      globalLogger.info("ReactApp", "Research complete. Running PedagogyAgent...");
      const script = await pedagogyAgent.execute({
        topic,
        audienceLevel,
        videoFormat: { width: 1920, height: 1080, fps: 60 },
        totalEstimatedDuration: 60,
        research
      });

      globalLogger.info("ReactApp", "Phase 3 Pipeline Success! Final Script generated.", { script });
    } catch (e) {
      globalLogger.error("ReactApp", "Pipeline failed", { error: String(e) });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 text-gray-900">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">AI-Tutor Phase 1 Testing</h1>
        <div className="flex gap-4">
          <button
            onClick={handleTestLog}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            Add Test Log
          </button>

          <button
            onClick={async () => {
              const service = new GeminiService(import.meta.env.VITE_GEMINI_API_KEY);
              try {
                const models = await service.listModels();
                globalLogger.info("ReactApp", `Retrieved ${models.length} models`, { models });
              } catch (e) {
                // error is already logged by the service
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"
          >
            Test Gemini (List Models)
          </button>

          <button 
            onClick={testPhase3Pipeline}
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
          >
            Test Pipeline (Phase 3)
          </button>
        </div>
      </div>
      
      {/* Persistent bottom drawer */}
      <div className="h-64 border-t border-gray-300">
        <LogPanel />
      </div>
    </div>
  );
}

export default App;
