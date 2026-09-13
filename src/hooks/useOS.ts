import { useSyncExternalStore } from 'react';
import { os, type OSSnapshot } from '../engine/osStore';

export function useOS(): OSSnapshot {
  return useSyncExternalStore(os.subscribe, os.getSnapshot, os.getSnapshot);
}

export const osApi = {
  openApp: os.openApp.bind(os),
  closeWindow: os.closeWindow.bind(os),
  focus: os.focus.bind(os),
  toggleMin: os.toggleMin.bind(os),
  toggleMax: os.toggleMax.bind(os),
  moveWindow: os.moveWindow.bind(os),
  resizeWindow: os.resizeWindow.bind(os),
  updateWindow: os.updateWindow.bind(os),
  toggleStart: os.toggleStart.bind(os),
  setContextMenu: os.setContextMenu.bind(os),
  setRenaming: os.setRenaming.bind(os),
  run: os.run.bind(os),
  explorerNewFolder: os.explorerNewFolder.bind(os),
  explorerRename: os.explorerRename.bind(os),
  explorerDelete: os.explorerDelete.bind(os),
  explorerCopy: os.explorerCopy.bind(os),
  restoreRecycle: os.restoreRecycle.bind(os),
  purgeRecycle: os.purgeRecycle.bind(os),
  emptyRecycle: os.emptyRecycle.bind(os),
  patchSettings: os.patchSettings.bind(os),
  askConfirm: os.askConfirm.bind(os),
  cancelConfirm: os.cancelConfirm.bind(os),
  runConfirm: os.runConfirm.bind(os),
  resetVfs: os.resetVfs.bind(os),
  resetProgress: os.resetProgress.bind(os),
  exportProgress: os.exportProgress.bind(os),
  importProgress: os.importProgress.bind(os),
  resetCurrentMission: os.resetCurrentMission.bind(os),
  completeFromExplorer: os.completeFromExplorer.bind(os),
  autocomplete: os.autocomplete.bind(os),
  finishWelcome: os.finishWelcome.bind(os),
  finishBoot: os.finishBoot.bind(os),
  skipBoot: os.skipBoot.bind(os),
  dismissToast: os.dismissToast.bind(os),
  resolvedTheme: os.resolvedTheme.bind(os),
  continueTutorial: os.continueTutorial.bind(os),
  restartLesson: os.restartLesson.bind(os),
  retryStep: os.retryStep.bind(os),
  revealHint: os.revealHint.bind(os),
  showAnswer: os.showAnswer.bind(os),
  hideAnswer: os.hideAnswer.bind(os),
  focusTerminal: os.focusTerminal.bind(os),
  answerQuestion: os.answerQuestion.bind(os),
  setAcademyTab: os.setAcademyTab.bind(os),
  setActiveMission: os.setActiveMission.bind(os),
  startLesson: os.startLesson.bind(os),
  enterLesson: os.enterLesson.bind(os),
  startMission: os.startMission.bind(os),
  enterMission: os.enterMission.bind(os),
  restartMission: os.restartMission.bind(os),
  goNextLesson: os.goNextLesson.bind(os),
  playerLevel: os.playerLevel.bind(os),
  terminalButtonState: os.terminalButtonState.bind(os),
  openLearningWorkspace: os.openLearningWorkspace.bind(os),
  fitToStage: os.fitToStage.bind(os),
};

export function useOSApi() {
  return osApi;
}

export function useClock() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const id = window.setInterval(onStoreChange, 1000);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / 1000),
    () => Math.floor(Date.now() / 1000),
  );
}
