import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/Nav/SiteLayout';
import { AchievementsPage } from './pages/Achievements/AchievementsPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { HomePage } from './pages/Home/HomePage';
import { AcademyEntry, LessonLabPage, MissionLabPage } from './pages/Lab/LabPage';
import { TrackPage } from './pages/Learn/TrackPage';
import { MissionsPage } from './pages/Missions/MissionsPage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

export function AppRouter() {
  return (
    <Routes>
      {/* The lab runs full screen, without the site header. */}
      <Route path="/academy" element={<AcademyEntry />} />
      <Route path="/academy/files/:lessonId" element={<LessonLabPage />} />
      <Route path="/missions/:missionId" element={<MissionLabPage />} />

      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/learn" element={<Navigate to="/learn/files" replace />} />
        <Route path="/learn/:trackId" element={<TrackPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
