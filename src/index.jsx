import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Moovee from './components/App.jsx'
import Suggestions from './components/Suggestions/index.jsx'
import Results from './components/Results/index.jsx'
import ErrorPage from './components/ErrorPage/index.jsx'

createRoot(document.getElementById('root')).render(
  <RouterProvider
    router={createBrowserRouter([
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
    ])}
  />
)
