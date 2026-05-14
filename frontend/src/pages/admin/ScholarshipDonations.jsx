import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../utils/axios'
import Navbar from '../../components/Navbar'
import '../../styles/scholarship.css'

const ScholarshipDonations = () => {
  const { user } = useAuth()
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`/scholarships/${id}/donations`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setData(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (!data) return <div><Navbar /><p style={{ padding: '20px' }}>Loading...</p></div>

  return (
    <div>
      <Navbar />
      <div className="scholarship-wrapper">
        <h3>{data.title} — Donations</h3>
        <div className="scholarship-card">
          <p>Target: ₹{data.targetAmount}</p>
          <p>Total Raised: ₹{data.totalDonated}</p>
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{ width: `${Math.min(data.percentage, 100)}%` }}></div>
          </div>
          <p style={{ fontSize: '11px', color: '#2e7d32' }}>{data.percentage}% funded</p>
        </div>
        <h3>Donor List</h3>
        <table className="donations-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Payment ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.donations.map((d, i) => (
              <tr key={i}>
                <td>{d.donor?.name}</td>
                <td>{d.donor?.email}</td>
                <td>₹{d.amount}</td>
                <td style={{ fontSize: '10px' }}>{d.paymentId}</td>
                <td>{new Date(d.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScholarshipDonations