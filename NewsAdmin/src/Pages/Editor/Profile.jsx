import { useEffect, useState } from 'react'
import axios from 'axios'
import EditorNavbar from '../../components/EditorNavbar'
import EditorSidebar from '../../components/EditorSidebar'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', email: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    axios.get(`${API}/user/getUser`, { withCredentials: true })
      .then((r) => setProfile({ username: r.data.user.username, email: r.data.user.email }))
  }, [])

  const save = async () => {
    try {
      await axios.patch(`${API}/user/update`, { username: profile.username }, { withCredentials: true })
      setMsg('Profile updated')
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Update failed')
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <EditorNavbar />
      <div className='flex'>
        <EditorSidebar />
        <main className='p-6 flex-1 space-y-3 max-w-xl'>
          <h1 className='text-xl font-semibold'>My Profile</h1>
          <input className='border p-2 rounded w-full' value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
          <input className='border p-2 rounded w-full bg-slate-100' value={profile.email} disabled />
          {msg && <div className='text-sm text-slate-600'>{msg}</div>}
          <button onClick={save} className='bg-blue-700 text-white px-4 py-2 rounded'>Save</button>
        </main>
      </div>
    </div>
  )
}

export default Profile


