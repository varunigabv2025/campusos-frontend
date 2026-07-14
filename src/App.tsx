import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastViewport } from './components/ui/Toast';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import type { Role } from './types';

// Pages
import Landing from './pages/Landing';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Dashboards
import Dashboard from './pages/dashboard/Dashboard';
import { MemberDashboard, LeadDashboard, FacultyDashboard } from './pages/dashboard/Dashboard';

// Shared app pages
import EventsPage from './pages/dashboard/EventsPage';
import ProjectsPage from './pages/dashboard/ProjectsPage';
import BlogsPage from './pages/dashboard/BlogsPage';
import GalleryPage from './pages/dashboard/GalleryPage';
import LeaderboardPage from './pages/dashboard/LeaderboardPage';
import AnnouncementsPage from './pages/dashboard/AnnouncementsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public ───────────────────────────────── */}
            <Route path="/" element={<Landing />} />
            <Route path="/login/member"  element={<LoginPage role="member"  />} />
            <Route path="/login/lead"    element={<LoginPage role="lead"    />} />
            <Route path="/login/faculty" element={<LoginPage role="faculty" />} />
            <Route path="/signup/:role"  element={<SignupWrapper />} />

            {/* ── Legacy role redirect helpers ─────────── */}
            <Route path="/member/dashboard"  element={<ProtectedRoute><Navigate to="/app/member"  replace /></ProtectedRoute>} />
            <Route path="/lead/dashboard"    element={<ProtectedRoute><Navigate to="/app/lead"    replace /></ProtectedRoute>} />
            <Route path="/faculty/dashboard" element={<ProtectedRoute><Navigate to="/app/faculty" replace /></ProtectedRoute>} />

            {/* ── Protected App shell ───────────────────── */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Default → role-aware redirect */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Role-specific dashboards */}
              <Route path="member"  element={<MemberDashboard  />} />
              <Route path="lead"    element={<LeadDashboard    />} />
              <Route path="faculty" element={<FacultyDashboard />} />

              {/* Shared pages */}
              <Route path="events"        element={<EventsPage       />} />
              <Route path="projects"      element={<ProjectsPage     />} />
              <Route path="blogs"         element={<BlogsPage        />} />
              <Route path="gallery"       element={<GalleryPage      />} />
              <Route path="leaderboard"   element={<LeaderboardPage  />} />
              <Route path="announcements" element={<AnnouncementsPage/>} />
              <Route path="profile"       element={<ProfilePage      />} />
              <Route path="settings"      element={<SettingsPage     />} />

              {/* Faculty-only stubs (same shell, placeholder content) */}
              <Route path="approvals"  element={<AnnouncementsPage />} />
              <Route path="analytics"  element={<AnnouncementsPage />} />
              <Route path="reports"    element={<AnnouncementsPage />} />
              <Route path="clubs"      element={<AnnouncementsPage />} />
              <Route path="members"    element={<AnnouncementsPage />} />
            </Route>

            {/* ── Catch-all ─────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastViewport />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

function SignupWrapper() {
  const { role } = useParams<{ role: string }>();
  const validRole = (['member', 'lead', 'faculty'].includes(role ?? '') ? role : 'member') as Role;
  return <SignupPage role={validRole} />;
}
