import { useEffect } from 'react';
import { Desktop } from './components/Desktop/Desktop';
import { LabDock } from './components/Lab/LabDock';
import { LabTopBar } from './components/Lab/LabTopBar';
import { BootScreen } from './components/Onboarding/BootScreen';
import { WelcomeScreen } from './components/Onboarding/WelcomeScreen';
import { BurstLayer, ConfirmDialog, ContextMenu, ToastStack } from './components/UI/Chrome';
import { WindowManager } from './components/Windows/WindowManager';
import { useAppChrome } from './hooks/useAppChrome';
import { useOS, useOSApi } from './hooks/useOS';
import { usePreferences } from './features/preferences/PreferencesProvider';

export default function App() {
  const { phase, windows, settings } = useOS();
  const api = useOSApi();
  const { t } = usePreferences();
  useAppChrome();

  useEffect(() => {
    if (phase !== 'desktop') return;
    if (windows.length === 0) api.openLearningWorkspace();
  }, [phase, windows.length, api]);

  useEffect(() => {
    // The site's Homepage already covers this introductory messaging, so
    // arriving at /app/lab skips the in-app welcome screen and goes
    // straight to the boot transition.
    if (phase === 'welcome') api.finishWelcome();
  }, [phase, api]);

  useEffect(() => {
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => api.fitToStage(), 120);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [api]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        api.toggleStart(false);
        api.setContextMenu(null);
        api.cancelConfirm();
        api.setRenaming(null);
      }
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === '1') {
        e.preventDefault();
        api.focusTerminal();
      }
      if (e.key === '2') {
        e.preventDefault();
        api.patchSettings({ showHints: !settings.showHints });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [api, settings.showHints]);

  if (phase === 'welcome') return <WelcomeScreen />;
  if (phase === 'boot') return <BootScreen />;

  return (
    <div className="os-root">
      <a className="skip-link" href="#lab-main">
        {t('skipLab')}
      </a>
      <LabTopBar />
      <div className="lab-stage" id="lab-main" tabIndex={-1} role="main">
        <Desktop />
        <WindowManager />
      </div>
      <LabDock />
      <ToastStack />
      <ConfirmDialog />
      <ContextMenu />
      <BurstLayer />
    </div>
  );
}
