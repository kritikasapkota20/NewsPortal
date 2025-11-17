import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import EditorNavbar from '../../components/EditorNavbar'
import EditorSidebar from '../../components/EditorSidebar'
import { FaLock, FaSignOutAlt } from 'react-icons/fa'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const Profile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ username: '', email: '' })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    axios.get(`${API}/user/getUser`, { withCredentials: true })
      .then((r) => setProfile({ username: r.data.user.username, email: r.data.user.email }))
      .catch(() => toast.error('Failed to fetch profile'))
  }, [])

  const save = async () => {
    try {
      await axios.put(`${API}/user/profile`, { username: profile.username, email: profile.email }, { withCredentials: true })
      toast.success('Profile updated')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Update failed')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      await axios.patch(`${API}/editor/change-password`, passwordData, { withCredentials: true })
      toast.success('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/editor/logout`, {}, { withCredentials: true })
      toast.success('Logged out successfully')
      navigate('/Editor/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <EditorNavbar />
      <div className='flex'>
        <EditorSidebar />
        <main className='p-6 flex-1 space-y-6 max-w-2xl'>
          <h1 className='text-2xl font-semibold'>My Profile</h1>
          
          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-lg font-semibold mb-4'>Profile Information</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Username</label>
                <input 
                  className='border p-2 rounded w-full' 
                  value={profile.username} 
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })} 
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                <input 
                  className='border p-2 rounded w-full bg-slate-100' 
                  value={profile.email} 
                  disabled 
                />
              </div>
              <button onClick={save} className='bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition'>
                Save Changes
              </button>
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <FaLock /> Change Password
              </h2>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className='text-blue-600 hover:text-blue-700'
              >
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Current Password</label>
                  <input
                    type='password'
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className='border p-2 rounded w-full'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>New Password</label>
                  <input
                    type='password'
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className='border p-2 rounded w-full'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm New Password</label>
                  <input
                    type='password'
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className='border p-2 rounded w-full'
                    required
                  />
                </div>
                <button type='submit' className='bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition'>
                  Update Password
                </button>
              </form>
            )}
          </div>

          <div className='bg-white p-6 rounded-lg shadow'>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 text-red-600 hover:text-red-700'
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile


