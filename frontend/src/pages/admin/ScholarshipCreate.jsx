
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from '../../utils/axios'
import Navbar from '../../components/Navbar'
import '../../styles/scholarship.css'
import '../../styles/auth.css'

const ScholarshipCreate = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    department: '',
    eligibility: ''
  })
  const [scholarships, setScholarships] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchScholarships()
  }, [])

  const fetchScholarships = async () => {
    try {
      const res = await axios.get('/scholarships', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setScholarships(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/scholarships', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setMessage('Scholarship created successfully')
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        deadline: '',
        department: '',
        eligibility: ''
      })
      fetchScholarships()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create scholarship')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/scholarships/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      fetchScholarships()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="scholarship-wrapper">
        <h3>Post New Scholarship</h3>
        {message && <p style={{ color: 'green', fontSize: '12px', marginBottom: '10px' }}>{message}</p>}
        {error && <p className="error-msg">{error}</p>}
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '20px', marginBottom: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required style={{ width: '100%', padding: '7px 9px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }} />
            </div>
            <div className="form-group">
              <label>Target Amount (₹)</label>
              <input type="number" name="targetAmount" value={formData.targetAmount} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Eligibility</label>
              <input type="text" name="eligibility" value={formData.eligibility} onChange={handleChange} />
            </div>
            <button type="submit" className="btn-primary">Post Scholarship</button>
          </form>
        </div>

        <h3>All Scholarships</h3>
        {scholarships.map(s => (
          <div className="scholarship-card" key={s._id}>
            <h4>{s.title}</h4>
            <p>{s.description}</p>
            <div className="scholarship-meta">
              <span>Department: {s.department}</span>
              <span>Target: ₹{s.targetAmount}</span>
              <span>Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar" style={{ width: `${Math.min((s.totalDonated / s.targetAmount) * 100, 100)}%` }}></div>
            </div>
            <p style={{ fontSize: '11px', color: '#2e7d32' }}>
              ₹{s.totalDonated} raised of ₹{s.targetAmount} ({Math.round((s.totalDonated / s.targetAmount) * 100)}%)
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="btn-donate" onClick={() => window.location.href = `/admin/scholarships/${s._id}/donations`}>
                View Donations
              </button>
              <button onClick={() => handleDelete(s._id)} style={{ padding: '6px 14px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScholarshipCreate