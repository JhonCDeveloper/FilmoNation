import { RouterProvider } from 'react-router';
import { router } from './presentation/routes/router';
import { AppProviders } from './presentation/providers/app-providers';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
