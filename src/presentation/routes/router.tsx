import { createBrowserRouter } from 'react-router';
import { RootLayout } from './root-layout';
import Home from '../pages/HomePage';
import MovieDetailPage from '../pages/MovieDetailPage';
import TerritoryPage from '../pages/TerritoryPage';
import PassportPage from '../pages/PassportPage';

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
      {
        path: 'pasaporte',
        element: <PassportPage />,
      },
    ],
  },
]);
