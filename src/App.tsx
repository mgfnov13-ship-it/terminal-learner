import { useEffect } from 'react';
import { Desktop } from './components/Desktop/Desktop';
import { BootScreen } from './components/Onboarding/BootScreen';
import { WelcomeScreen } from './components/Onboarding/WelcomeScreen';
import { Taskbar } from './components/Taskbar/Taskbar';
import { BurstLayer, ConfirmDialog, ContextMenu, ToastStack } from './components/UI/Chrome';
import { WindowManager } from './components/Windows/WindowManager';
import { useOS, useOSApi } from './hooks/useOS';

export default function App() {
  const { phase } = useOS();
  const api = useOSApi();
  const theme = api.resolvedTheme();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        api.toggleStart(false);
        api.setContextMenu(null);
        api.cancelConfirm();
        api.setRenaming(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [api]);

  if (phase === 'welcome') return <WelcomeScreen />;
  if (phase === 'boot') return <BootScreen />;

  return (
    <div className="os-root">
      <Desktop />
      <WindowManager />
      <Taskbar />
      <ToastStack />
      <ConfirmDialog />
      <ContextMenu />
      <BurstLayer />
    </div>
  );
}
