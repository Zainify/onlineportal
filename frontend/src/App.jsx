import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import TeacherRequest from './pages/auth/TeacherRequest.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx'
import ParentDashboard from './pages/parent/ParentDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Notes from './pages/student/Notes.jsx'
import Lectures from './pages/student/Lectures.jsx'
import QuizList from './pages/student/QuizList.jsx'
import QuizDetail from './pages/student/QuizDetail.jsx'
import AttemptQuiz from './pages/student/AttemptQuiz.jsx'
import Results from './pages/student/Results.jsx'
import Performance from './pages/student/Performance.jsx'
import UploadNotes from './pages/teacher/UploadNotes.jsx'
import UploadLectures from './pages/teacher/UploadLectures.jsx'
import CreateQuiz from './pages/teacher/CreateQuiz.jsx'
import ManageQuizzes from './pages/teacher/ManageQuizzes.jsx'
import StudentAttempts from './pages/teacher/StudentAttempts.jsx'
import Analytics from './pages/teacher/Analytics.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'
import ApproveContent from './pages/admin/ApproveContent.jsx'
import SystemOverview from './pages/admin/SystemOverview.jsx'
import ManageSubjects from './pages/admin/ManageSubjects.jsx'
import ManageChapters from './pages/admin/ManageChapters.jsx'
import ManageNotes from './pages/admin/ManageNotes.jsx'
import ManageClasses from './pages/admin/ManageClasses.jsx'
import TeacherRequests from './pages/admin/TeacherRequests.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/public/Home.jsx'
import Books from './pages/public/Books.jsx'
import PublicClasses from './pages/public/Classes.jsx'
import PublicNotes from './pages/public/PublicNotes.jsx'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher-request" element={<TeacherRequest />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeOrDashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:grade" element={<Books />} />
          <Route path="classes" element={<PublicClasses />} />
          <Route path="notes" element={<PublicNotes />} />
          <Route path="notes/:grade" element={<PublicNotes />} />
          <Route path="dashboard" element={
            <ProtectedRoute roles={["student", "teacher", "parent", "admin"]}>
              <DashRouter />
            </ProtectedRoute>
          } />

          {/* Student */}
          <Route path="student/notes" element={<ProtectedRoute roles={["student"]}><Notes /></ProtectedRoute>} />
          <Route path="student/notes/:classId" element={<ProtectedRoute roles={["student"]}><Notes /></ProtectedRoute>} />
          <Route path="student/lectures" element={<ProtectedRoute roles={["student"]}><Lectures /></ProtectedRoute>} />
          <Route path="student/lectures/:classId" element={<ProtectedRoute roles={["student"]}><Lectures /></ProtectedRoute>} />
          <Route path="student/quizzes" element={<ProtectedRoute roles={["student"]}><QuizList /></ProtectedRoute>} />
          <Route path="student/quizzes/:classId" element={<ProtectedRoute roles={["student"]}><QuizList /></ProtectedRoute>} />
          <Route path="student/quiz/:id" element={<ProtectedRoute roles={["student"]}><QuizDetail /></ProtectedRoute>} />
          <Route path="student/quiz/:id/attempt" element={<ProtectedRoute roles={["student"]}><AttemptQuiz /></ProtectedRoute>} />
          <Route path="student/results" element={<ProtectedRoute roles={["student"]}><Results /></ProtectedRoute>} />
          <Route path="student/performance" element={<ProtectedRoute roles={["student"]}><Performance /></ProtectedRoute>} />

          {/* Teacher */}
          <Route path="teacher/upload-notes" element={<ProtectedRoute roles={["teacher", "admin"]}><UploadNotes /></ProtectedRoute>} />
          <Route path="teacher/upload-lectures" element={<ProtectedRoute roles={["teacher", "admin"]}><UploadLectures /></ProtectedRoute>} />
          <Route path="teacher/create-quiz" element={<ProtectedRoute roles={["teacher", "admin"]}><CreateQuiz /></ProtectedRoute>} />
          <Route path="teacher/manage-quizzes" element={<ProtectedRoute roles={["teacher", "admin"]}><ManageQuizzes /></ProtectedRoute>} />
          <Route path="teacher/student-attempts" element={<ProtectedRoute roles={["teacher", "admin"]}><StudentAttempts /></ProtectedRoute>} />
          <Route path="teacher/analytics" element={<ProtectedRoute roles={["teacher", "admin"]}><Analytics /></ProtectedRoute>} />

          {/* Parent */}
          <Route path="parent/dashboard" element={<ProtectedRoute roles={["parent"]}><ParentDashboard /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="admin/manage-users" element={<ProtectedRoute roles={["admin"]}><ManageUsers /></ProtectedRoute>} />
          <Route path="admin/manage-subjects" element={<ProtectedRoute roles={["admin"]}><ManageSubjects /></ProtectedRoute>} />
          <Route path="admin/manage-chapters" element={<ProtectedRoute roles={["admin"]}><ManageChapters /></ProtectedRoute>} />
          <Route path="admin/manage-notes" element={<ProtectedRoute roles={["admin"]}><ManageNotes /></ProtectedRoute>} />
          <Route path="admin/manage-classes" element={<ProtectedRoute roles={["admin"]}><ManageClasses /></ProtectedRoute>} />
          <Route path="admin/teacher-requests" element={<ProtectedRoute roles={["admin"]}><TeacherRequests /></ProtectedRoute>} />
          <Route path="admin/approve-content" element={<ProtectedRoute roles={["admin"]}><ApproveContent /></ProtectedRoute>} />
          <Route path="admin/system-overview" element={<ProtectedRoute roles={["admin"]}><SystemOverview /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

function DashRouter() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'student') return <StudentDashboard />
  if (user.role === 'teacher') return <TeacherDashboard />
  if (user.role === 'parent') return <ParentDashboard />
  if (user.role === 'admin') return <AdminDashboard />
  return null
}

function HomeOrDashboard() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return <Home />
}
