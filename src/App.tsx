import { RouterProvider } from 'react-router';
import { router } from './presentation/routes/router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
