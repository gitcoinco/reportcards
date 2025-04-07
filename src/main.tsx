import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="max-w-[1600px] mx-auto border-l border-r border-gray-100">
      <App />
    </div>
  </StrictMode>,
)
