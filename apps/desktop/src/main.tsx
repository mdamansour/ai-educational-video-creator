import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { globalLogger } from 'shared'
import { useLogStore } from './store/logStore'

// Connect the shared global logger to our React UI state
globalLogger.subscribe((entry) => {
  useLogStore.getState().addLog(entry);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
