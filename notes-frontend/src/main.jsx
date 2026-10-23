import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { ErrorBoundary } from "react-error-boundary";
import "react-toastify/dist/ReactToastify.css"
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
  <ErrorBoundary
    fallback={<h2>Something went wrong!</h2>}
  >
    <App />
  </ErrorBoundary>

  <ToastContainer />
</BrowserRouter>
  </StrictMode>
)
