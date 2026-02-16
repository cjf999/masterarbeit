//import dependencies
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

//import components/views
import App from './App.tsx'
import NotFound from './pages/NotFound.tsx'
import Compare from './pages/Compare.tsx'
import Result from './pages/Result.tsx'

const router = createBrowserRouter([
  {path: "/", element: <App />}, //default route
  {path: "*", element: <NotFound />}, //wenn nicht auflösbar, dann gehe hier hin (404)
  {path: "/compare", element: <Compare />},
  {path: "/result", element: <Result />},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
