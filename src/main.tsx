import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { Navbar } from "@gitcoin/ui";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="max-w-[1600px] mx-auto border-l border-r border-gray-100">
      <Navbar 
        showDivider={false}
        text={{text: "Report Cards"}}
      />
      <App />
    </div>
  </StrictMode>,
)
