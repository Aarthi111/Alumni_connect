import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from '../../utils/axios'
import Navbar from '../../components/Navbar'
import '../../styles/jobs.css'

const JobList = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/jobs', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.jobType === filter)

  return (
    <div>
      <Navbar />
      <div className="jobs-wrapper">
        <h3>Job Openings</h3>
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
          {['all', 'fulltime', 'parttime', 'internship'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: filter === type ? '#2e7d32' : '#fff',
                color: filter === type ? '#fff' : '#333'
              }}
            >
              {type === 'all' ? 'All' : type === 'fulltime' ? 'Full Time' : type === 'parttime' ? 'Part Time' : 'Internship'}
            </button>
          ))}
        </div>
        {filtered.length === 0 && <p style={{ fontSize: '13px', color: '#777' }}>No jobs available</p>}
        {filtered.map(job => (
          <div className="job-card" key={job._id}>
            <h4>{job.title}</h4>
            <p>{job.company} — posted by {job.postedBy?.name}</p>
            <p>{job.description}</p>
            <div className="job-meta">
              <span>{job.location}</span>
              <span>{job.jobType}</span>
              {job.salary && <span>{job.salary}</span>}
              <span>Last date: {new Date(job.lastDate).toLocaleDateString()}</span>
            </div>
            {job.applyLink && (
              <a href={job.applyLink} target="_blank" rel="noreferrer" className="btn-apply" style={{ marginTop: '10px' }}>
                Apply Now
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobList