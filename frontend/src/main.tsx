import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { warmUpApi } from './api/client'
import { App } from './App'
import './styles/index.css'

warmUpApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
