import type { RouteObject } from 'react-router'
import { Layout } from './Layout'
import { NotFoundPage, RouteErrorPage } from './pages/ErrorPages'
import { SearchPage } from './pages/SearchPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: 'search', element: <SearchPage /> },
      // Links from the CRA version used /results?q=.
      { path: 'results', element: <SearchPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]
