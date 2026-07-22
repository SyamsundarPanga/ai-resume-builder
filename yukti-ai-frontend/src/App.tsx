import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';

import ApiErrorBoundary from './components/error/ApiErrorBoundary';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiErrorBoundary>
          <AppRoutes />
        </ApiErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;