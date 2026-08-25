import { createBrowserRouter } from 'react-router';
import { RootLayout } from './root-layout';
import Home from '../pages/HomePage';
import MovieDetailPage from '../pages/MovieDetailPage';
import TerritoryPage from '../pages/TerritoryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'movie/:id',
        element: <MovieDetailPage />,
      },
      {
        path: 'territorio',
        element: <TerritoryPage />,
      },
    ],
  },
]);
