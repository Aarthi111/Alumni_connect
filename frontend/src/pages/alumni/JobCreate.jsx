import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from '../../utils/axios'
import Navbar from '../../components/Navbar'
import '../../styles/jobs.css'
import '../../styles/auth.css'

const JobCreate = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'fulltime',
    description: '',
    salary: '',
    lastDate: '',
    applyLink: ''
  })
  const [myJobs, setMyJobs] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyJobs()
  }, [])

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get('/jobs/myjobs', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setMyJobs(res.data)
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
      await axios.post('/jobs', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setMessage('Job posted successfully. Waiting for admin approval.')
      setFormData({
        title: '',
        company: '',
        location: '',
        jobType: 'fulltime',
        description: '',
        salary: '',
        lastDate: '',
        applyLink: ''
      })
      fetchMyJobs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      fetchMyJobs()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="jobs-wrapper">
        <h3>Post a Job</h3>
        {message && <p style={{ color: 'green', fontSize: '12px', marginBottom: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '20px', marginBottom: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange}>
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
                style={{ width: '100%', padding: '7px 9px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>
            <div className="form-group">
              <label>Salary (optional)</label>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Ex: 3-5 LPA" />
            </div>
            <div className="form-group">
              <label>Last Date to Apply</label>
              <input type="date" name="lastDate" value={formData.lastDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Apply Link (optional)</label>
              <input type="text" name="applyLink" value={formData.applyLink} onChange={handleChange} placeholder="https://..." />
            </div>
            <button type="submit" className="btn-primary">Post Job</button>
          </form>
        </div>

        <h3>My Posted Jobs</h3>
        {myJobs.length === 0 && <p style={{ fontSize: '13px', color: '#777' }}>No jobs posted yet</p>}
        {myJobs.map(job => (
          <div className="job-card" key={job._id}>
            <h4>{job.title}</h4>
            <p>{job.company}</p>
            <div className="job-meta">
              <span>{job.location}</span>
              <span>{job.jobType}</span>
              {job.salary && <span>{job.salary}</span>}
              <span>Last date: {new Date(job.lastDate).toLocaleDateString()}</span>
            </div>
            <span className={`job-status status-${job.status}`}>{job.status}</span>
            <div className="job-actions">
              <button onClick={() => handleDelete(job._id)} style={{ padding: '5px 12px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobCreate