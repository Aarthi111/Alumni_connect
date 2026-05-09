
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App



// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import OTPVerify from './pages/OTPVerify'
// import StudentDashboard from './pages/student/StudentDashboard'
// import AlumniDashboard from './pages/alumni/AlumniDashboard'
// import AdminDashboard from './pages/admin/AdminDashboard'
// import ProtectedRoute from './components/ProtectedRoute'

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path='/' element={<Login />} />
//         <Route path='/register' element={<Register />} />
//         <Route path='/verify-otp' element={<OTPVerify />} />
//         <Route path='/student/dashboard' element={
//           <ProtectedRoute allowedRoles={['student']}>
//             <StudentDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path='/alumni/dashboard' element={
//           <ProtectedRoute allowedRoles={['alumni']}>
//             <AlumniDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path='/admin/dashboard' element={
//           <ProtectedRoute allowedRoles={['admin']}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App