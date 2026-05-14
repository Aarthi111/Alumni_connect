import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">PSR Alumni Connect</div>
      <div className="nav-links">
        {user?.role === 'student' && (
          <>
            <Link to="/student/dashboard">Home</Link>
            <Link to="/student/profile">Profile</Link>
          </>
        )}
        {user?.role === 'alumni' && (
          <>
            <Link to="/alumni/dashboard">Home</Link>
            <Link to="/alumni/profile">Profile</Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/profile">Profile</Link>
          </>
        )}
        {user?.role === 'alumni' && (
        <>
            <Link to="/alumni/dashboard">Home</Link>
            <Link to="/alumni/scholarships">Scholarships</Link>
            <Link to="/alumni/profile">Profile</Link>
        </>
        )}
        {user?.role === 'admin' && (
        <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/scholarships">Scholarships</Link>
            <Link to="/admin/profile">Profile</Link>
        </>
        )}
        {user?.role === 'student' && (
          <>
            <Link to="/student/dashboard">Home</Link>
            <Link to="/student/jobs">Jobs</Link>
            <Link to="/student/profile">Profile</Link>
          </>
        )}
        {user?.role === 'alumni' && (
          <>
            <Link to="/alumni/dashboard">Home</Link>
            <Link to="/alumni/jobs">Post Job</Link>
            <Link to="/alumni/scholarships">Scholarships</Link>
            <Link to="/alumni/profile">Profile</Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/jobs">Job Approvals</Link>
            <Link to="/admin/scholarships">Scholarships</Link>
            <Link to="/admin/profile">Profile</Link>
          </>
        )}
        <span className="nav-user">{user?.name}</span>
        <button onClick={handleLogout} className="nav-logout">Logout</button>
      </div>
    </nav>
  )
}

export default Navbar