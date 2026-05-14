import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import OTPVerify from './pages/OTPVerify'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import ProtectedRoute from './components/ProtectedRoute'
import ScholarshipCreate from './pages/admin/ScholarshipCreate'
import ScholarshipList from './pages/alumni/ScholarshipList'
import ScholarshipDonations from './pages/admin/ScholarshipDonations'
import JobCreate from './pages/alumni/JobCreate'
import JobList from './pages/student/JobList'
import JobApproval from './pages/admin/JobApproval'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/student/profile' element={
        <ProtectedRoute allowedRoles={['student']}>
             <StudentProfile />
        </ProtectedRoute>
        } />
        <Route path='/admin/scholarships' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ScholarshipCreate />
          </ProtectedRoute>
        } />
        <Route path='/admin/scholarships/:id/donations' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ScholarshipDonations />
          </ProtectedRoute>
        } />
        <Route path='/alumni/scholarships' element={
          <ProtectedRoute allowedRoles={['alumni']}>
            <ScholarshipList />
          </ProtectedRoute>
        } />
         <Route path='/student/dashboard' element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
          <Route path='/alumni/jobs' element={
          <ProtectedRoute allowedRoles={['alumni']}>
            <JobCreate />
          </ProtectedRoute>
        } />
        <Route path='/student/jobs' element={
          <ProtectedRoute allowedRoles={['student']}>
            <JobList />
          </ProtectedRoute>
        } />
        <Route path='/admin/jobs' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <JobApproval />
          </ProtectedRoute>
        } />
        <Route path='/verify-otp' element={<OTPVerify />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
