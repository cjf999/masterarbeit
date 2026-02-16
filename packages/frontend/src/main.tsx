import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './pages/NotFound.tsx'

const router = createBrowserRouter([
  {path: "/", element: <App />}, //default route
  {path: "*", element: <NotFound />}, //wenn nicht auflösbar, dann gehe hier hin (404)
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
