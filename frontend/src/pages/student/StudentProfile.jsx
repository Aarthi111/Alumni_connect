import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from '../../utils/axios'
import Navbar from '../../components/Navbar'
import '../../styles/profile.css'

const StudentProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState({})
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/profile', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setProfile(res.data)
      setFormData(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put('/users/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setProfile(res.data)
      setEditing(false)
      setMessage('Profile updated successfully')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-box">
          <h3>My Profile</h3>
          {message && <p className="success-msg">{message}</p>}
          {!editing ? (
            <div className="profile-details">
              <div className="profile-row">
                <span>Name</span>
                <span>{profile.name}</span>
              </div>
              <div className="profile-row">
                <span>Email</span>
                <span>{profile.email}</span>
              </div>
              <div className="profile-row">
                <span>Department</span>
                <span>{profile.department || 'Not set'}</span>
              </div>
              <div className="profile-row">
                <span>Batch</span>
                <span>{profile.batch || 'Not set'}</span>
              </div>
              <div className="profile-row">
                <span>Phone</span>
                <span>{profile.phone || 'Not set'}</span>
              </div>
              <div className="profile-row">
                <span>Bio</span>
                <span>{profile.bio || 'Not set'}</span>
              </div>
              <button className="btn-edit" onClick={() => setEditing(true)}>Edit Profile</button>
            </div>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" value={formData.department || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <input type="text" name="batch" value={formData.batch || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="3" />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentProfile