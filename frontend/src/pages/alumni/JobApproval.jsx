import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from '../../utils/axios'
import Navbar from '../../components/Navbar'
import '../../styles/jobs.css'

const JobApproval = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPendingJobs()
  }, [])

  const fetchPendingJobs = async () => {
    try {
      const res = await axios.get('/jobs/pending', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleApprove = async (id) => {
    try {
      await axios.put(`/jobs/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setMessage('Job approved')
      fetchPendingJobs()
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.put(`/jobs/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setMessage('Job rejected')
      fetchPendingJobs()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="jobs-wrapper">
        <h3>Pending Job Approvals</h3>
        {message && <p style={{ color: 'green', fontSize: '12px', marginBottom: '10px' }}>{message}</p>}
        {jobs.length === 0 && <p style={{ fontSize: '13px', color: '#777' }}>No pending jobs</p>}
        {jobs.map(job => (
          <div className="job-card" key={job._id}>
            <h4>{job.title}</h4>
            <p>{job.company} — posted by {job.postedBy?.name} ({job.postedBy?.email})</p>
            <p>{job.description}</p>
            <div className="job-meta">
              <span>{job.location}</span>
              <span>{job.jobType}</span>
              {job.salary && <span>{job.salary}</span>}
              <span>Last date: {new Date(job.lastDate).toLocaleDateString()}</span>
            </div>
            <div className="job-actions">
              <button className="btn-approve" onClick={() => handleApprove(job._id)}>Approve</button>
              <button className="btn-reject" onClick={() => handleReject(job._id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobApproval