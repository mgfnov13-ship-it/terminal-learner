import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';
import { AchievementsPage } from './pages/Achievements/AchievementsPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { HomePage } from './pages/Home/HomePage';
import { AcademyEntry, LessonLabPage, MissionLabPage } from './pages/Lab/LabPage';
import { TrackPage } from './pages/Learn/TrackPage';
import { MissionsPage } from './pages/Missions/MissionsPage';
import { MissionDetailPage } from './pages/Missions/MissionDetailPage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { ProgressPage } from './pages/Progress/ProgressPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { AppHelpPage } from './pages/Help/AppHelpPage';
import { TracksPage } from './pages/Public/TracksPage';
import { TracksFilesPage } from './pages/Public/TracksFilesPage';
import { HowItWorksPage } from './pages/Public/HowItWorksPage';
import { DemoPage } from './pages/Public/DemoPage';
import { AboutPage } from './pages/Public/AboutPage';
import { PublicHelpPage } from './pages/Public/PublicHelpPage';
import { ContactPage } from './pages/Public/ContactPage';
import { PrivacyPage } from './pages/Public/PrivacyPage';
import { TermsPage } from './pages/Public/TermsPage';
import { SignInPage } from './pages/Auth/SignInPage';
import { SignUpPage } from './pages/Auth/SignUpPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage';
import { VerifyPage } from './pages/Auth/VerifyPage';
import { AuthCallbackPage } from './pages/Auth/AuthCallbackPage';
import { RequireAuth } from './features/auth/RequireAuth';

export function AppRouter() {
  return (
    <Routes>
      {/* The lab runs full screen, without site chrome. */}
      <Route
        path="/app/lab"
        element={
          <RequireAuth>
            <AcademyEntry />
          </RequireAuth>
        }
      />
      <Route
        path="/app/lab/files/:lessonId"
        element={
          <RequireAuth>
            <LessonLabPage />
          </RequireAuth>
        }
      />
      <Route
        path="/app/lab/mission/:missionId"
        element={
          <RequireAuth>
            <MissionLabPage />
          </RequireAuth>
        }
      />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tracks" element={<TracksPage />} />
        <Route path="/tracks/files" element={<TracksFilesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<PublicHelpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/auth/sign-in" element={<SignInPage />} />
        <Route path="/auth/sign-up" element={<SignUpPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify" element={<VerifyPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/learn" element={<Navigate to="/app/learn/files" replace />} />
        <Route path="/app/learn/:trackId" element={<TrackPage />} />
        <Route path="/app/missions" element={<MissionsPage />} />
        <Route path="/app/missions/:missionId" element={<MissionDetailPage />} />
        <Route path="/app/progress" element={<ProgressPage />} />
        <Route path="/app/achievements" element={<AchievementsPage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/app/help" element={<AppHelpPage />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
