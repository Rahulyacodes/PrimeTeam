// src/App.jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Lazy-loaded page components (code-split into separate on-demand JS bundles)
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const RegisterPage      = lazy(() => import('./pages/RegisterPage'))
const DashboardPage     = lazy(() => import('./pages/DashboardPage'))
const BoardPage         = lazy(() => import('./pages/BoardPage'))
const SettingsPage      = lazy(() => import('./pages/SettingsPage'))
const LandingPage       = lazy(() => import('./pages/LandingPage'))
const InviteLandingPage = lazy(() => import('./pages/InviteLandingPage'))
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'))

// Sleek dark loader for seamless route transitions
function PageLoader() {
  return (
    <div className="min-h-screen w-full bg-[#0C0C12] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-purple-500/25 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )
}

// protects routes — if not logged in, redirect to landing page
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/landing" replace />
}

// Smart home route: if logged in -> Dashboard, else -> Landing Page
function HomeRoute() {
  const { user } = useAuth()
  return user ? <DashboardPage /> : <LandingPage />
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/landing"  element={<LandingPage />} />
          <Route path="/invite" element={<Navigate to="/" replace />} />
          <Route path="/invite/:inviteToken" element={<InviteLandingPage />} />
          <Route path="/" element={<HomeRoute />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }/>
          <Route path="/board/:boardId" element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }/>
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }/>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App