import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from '../../utils/axios'
import Navbar from '../../components/Navbar'
import '../../styles/scholarship.css'

const ScholarshipList = () => {
  const { user } = useAuth()
  const [scholarships, setScholarships] = useState([])
  const [donationAmount, setDonationAmount] = useState({})
  const [message, setMessage] = useState('')

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

  const handleDonate = async (scholarshipId) => {
    const amount = donationAmount[scholarshipId]
    if (!amount || amount <= 0) {
      alert('Enter a valid amount')
      return
    }
    try {
      // Create order
      const orderRes = await axios.post(`/scholarships/${scholarshipId}/donate/order`,
        { amount },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )

      const { orderId, keyId } = orderRes.data

      // Open Razorpay
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'PSR Alumni Connect',
        description: 'Scholarship Donation',
        order_id: orderId,
        handler: async (response) => {
          try {
            await axios.post(`/scholarships/${scholarshipId}/donate/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              scholarshipId,
              amount
            }, {
              headers: { Authorization: `Bearer ${user.token}` }
            })
            setMessage('Donation successful! Thank you.')
            fetchScholarships()
          } catch (err) {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: { color: '#2e7d32' }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      alert('Failed to initiate payment')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="scholarship-wrapper">
        <h3>Scholarships</h3>
        {message && <p style={{ color: 'green', fontSize: '12px', marginBottom: '10px' }}>{message}</p>}
        {scholarships.map(s => (
          <div className="scholarship-card" key={s._id}>
            <h4>{s.title}</h4>
            <p>{s.description}</p>
            <div className="scholarship-meta">
              <span>Department: {s.department}</span>
              <span>Target: ₹{s.targetAmount}</span>
              <span>Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
            </div>
            {s.eligibility && <p style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>Eligibility: {s.eligibility}</p>}
            <div className="progress-bar-wrapper">
              <div className="progress-bar" style={{ width: `${Math.min((s.totalDonated / s.targetAmount) * 100, 100)}%` }}></div>
            </div>
            <p style={{ fontSize: '11px', color: '#2e7d32' }}>
              ₹{s.totalDonated} raised of ₹{s.targetAmount} ({Math.round((s.totalDonated / s.targetAmount) * 100)}%)
            </p>
            <div className="donation-input">
              <input
                type="number"
                placeholder="Enter amount ₹"
                value={donationAmount[s._id] || ''}
                onChange={(e) => setDonationAmount({ ...donationAmount, [s._id]: e.target.value })}
              />
              <button className="btn-donate" onClick={() => handleDonate(s._id)}>
                Donate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScholarshipList