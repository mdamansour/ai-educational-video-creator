import { LogPanel } from "./components/LogPanel";
import { useLogStore } from "./store/logStore";

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

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 text-gray-900">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">AI-Tutor Phase 1 Testing</h1>
        <button
          onClick={handleTestLog}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Add Test Log
        </button>
      </div>
      
      {/* Persistent bottom drawer */}
      <div className="h-64 border-t border-gray-300">
        <LogPanel />
      </div>
    </div>
  );
}

export default App;
