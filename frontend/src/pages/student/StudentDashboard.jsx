import { useAuth } from '../../context/AuthContext'

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
export default StudentDashboard