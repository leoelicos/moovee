import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

/* routes */
import Moovee from './components/App.jsx'
import Suggestions from './components/Suggestions/index.jsx'
import Results from './components/Results/index.jsx'
import ErrorPage from './components/ErrorPage/index.jsx'

function init() {
  const domNode = document.getElementById('root')
  const root = createRoot(domNode)
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Moovee />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <Suggestions />,
          errorElement: <ErrorPage />
        },
        {
          path: '/results',
          element: <Results />,
          errorElement: <ErrorPage />
        }
      ]
    }
  ])
  const routerProvider = <RouterProvider router={router} />
  root.render(routerProvider)
}

init()
