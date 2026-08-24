import { createBrowserRouter } from 'react-router';
import { RootLayout } from './root-layout';
import Home from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);
