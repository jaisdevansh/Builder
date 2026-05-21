import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster 
      position="bottom-center"
      toastOptions={{
        style: {
          background: '#18181b', // zinc-900
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }} 
    />
    <App />
  </StrictMode>,
)
