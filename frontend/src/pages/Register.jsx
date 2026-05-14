import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../utils/axios'
import '../styles/auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    batch: '',
    department: '',
    company: '',
    linkedIn: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/register', formData)
      navigate('/verify-otp', { state: { userId: res.data.userId } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>PSR Engineering College</h2>
        <h3>Alumni Connect — Register</h3>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          {formData.role === 'alumni' && (
            <>
              <div className="form-group">
                <label>Batch Year</label>
                <input
                  type="text"
                  name="batch"
                  placeholder="Ex: 2020"
                  value={formData.batch}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Ex: CSE"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Current company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedIn"
                  placeholder="LinkedIn profile URL"
                  value={formData.linkedIn}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register