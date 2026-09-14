import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RouteFocus } from './components/A11y/RouteFocus';
import { AppRouter } from './AppRouter';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { AuthProvider } from './features/auth/AuthProvider';
import { PreferencesProvider } from './features/preferences/PreferencesProvider';
import { ProgressSyncController } from './features/sync/ProgressSyncController';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <PreferencesProvider>
            <ProgressSyncController />
            <RouteFocus />
            <AppRouter />
          </PreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
