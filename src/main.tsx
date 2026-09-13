import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { AuthProvider } from './features/auth/AuthProvider';
import { ProgressSyncController } from './features/sync/ProgressSyncController';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProgressSyncController />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
