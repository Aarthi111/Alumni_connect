import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../utils/axios'
import '../styles/auth.css'

const OTPVerify = () => {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/verify-otp', { userId, otp })
      setMessage(res.data.message)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Email Verification</h2>
        <h3>Enter the OTP sent to your email</h3>
        {error && <p className="error-msg">{error}</p>}
        {message && <p style={{ color: 'green', fontSize: '12px', marginBottom: '10px' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter 6 digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Verify</button>
        </form>
      </div>
    </div>
  )
}

export default OTPVerify