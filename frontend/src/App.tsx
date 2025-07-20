import React from 'react'
import { Routes, Route } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppProviders } from "@/providers/AppProviders"

// Pages publiques
import Home from "./pages/Home"
import About from "./pages/About"
import Programs from "./pages/Programs"
import Contact from "./pages/Contact"

// Pages d'authentification
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword"
import EmailVerification from "./pages/EmailVerification"

// Pages d'onboarding
import OnboardingWelcome from "./pages/OnboardingWelcome"
import RoleSelection from "./pages/RoleSelection"
import ProfileSetup from "./pages/ProfileSetup"

// Pages protégées
import Dashboard from "./pages/Dashboard"
import ApiTest from "./pages/ApiTest"
import NotFound from "./pages/NotFound"

// Pages éducation
import Courses from "./pages/education/Courses"
import CourseDetail from "./pages/education/CourseDetail"
import CourseLearning from "./pages/education/CourseLearning"

// Pages entrepreneuriat
import Projects from "./pages/entrepreneurship/Projects"
import ProjectDetail from "./pages/entrepreneurship/ProjectDetail"

// Pages lab
import Equipment from "./pages/lab/Equipment"
import EquipmentDetail from "./pages/lab/EquipmentDetail"
import EquipmentReservation from "./pages/lab/EquipmentReservation"

// Pages forum
import Forum from "./pages/forum/Forum"
import ForumCategory from "./pages/forum/ForumCategory"
import CreateTopic from "./pages/forum/CreateTopic"

// Pages notifications
import Notifications from "./pages/notifications/Notifications"
import NotificationSettings from "./pages/notifications/NotificationSettings"

// Pages organisations
import Organizations from "./pages/organizations/Organizations"

// Pages recherche
import Search from "./pages/search/Search"

// Composants de protection des routes
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { PublicRoute } from "@/components/PublicRoute"

const App: React.FC = () => {
  return (
    <AppProviders>
      <TooltipProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/contact" element={<Contact />} />

          {/* Routes d'authentification (accessibles seulement si non connecté) */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/email-verification" element={<EmailVerification />} />

          {/* Routes d'onboarding (accessibles après connexion) */}
          <Route path="/onboarding/welcome" element={
            <ProtectedRoute>
              <OnboardingWelcome />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/role" element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/profile" element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } />

          {/* Routes protégées */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Routes éducation - TEMPORAIREMENT PUBLIQUES POUR TEST */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/courses/:courseId/learn" element={<CourseLearning />} />

          {/* Routes entrepreneuriat - TEMPORAIREMENT PUBLIQUES POUR TEST */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />

          {/* Routes lab - TEMPORAIREMENT PUBLIQUES POUR TEST */}
          <Route path="/lab/equipment" element={<Equipment />} />
          <Route path="/lab/equipment/:equipmentId" element={<EquipmentDetail />} />
          <Route path="/lab/equipment/:equipmentId/reserve" element={<EquipmentReservation />} />

          {/* Routes forum - TEMPORAIREMENT PUBLIQUES POUR TEST */}
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/category/:categoryId" element={<ForumCategory />} />
          <Route path="/forum/create" element={<CreateTopic />} />

          {/* Routes notifications - TEMPORAIREMENT PUBLIQUES POUR TEST */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/settings" element={<NotificationSettings />} />

          {/* Routes organisations - TEMPORAIREMENT PUBLIQUES POUR TEST */}
          <Route path="/organizations" element={<Organizations />} />

          {/* Routes recherche - TEMPORAIREMENT PUBLIQUES POUR TEST */}
          <Route path="/search" element={<Search />} />

          {/* Route de test API - TEMPORAIRE POUR DÉVELOPPEMENT */}
          <Route path="/api-test" element={<ApiTest />} />

          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppProviders>
  )
}

export default App
