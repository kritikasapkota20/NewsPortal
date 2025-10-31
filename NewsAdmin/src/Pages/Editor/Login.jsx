import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const EditorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      await axios.post(`${API}/editor/login`, form, { withCredentials: true })
      const me = await axios.get(`${API}/user/getUser`, { withCredentials: true })
      const role = me?.data?.user?.role
      if (typeof role === 'string' && role.toLowerCase() === 'editor') navigate('/Editor/dashboard')
      else setErr('Account is not an Editor')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className='min-h-screen grid place-items-center bg-slate-50'>
      <form onSubmit={submit} className='bg-white p-6 rounded-xl shadow w-full max-w-sm'>
        <h1 className='text-xl font-semibold mb-4 text-blue-700'>Editor Login</h1>
        <input className='border p-2 rounded w-full mb-3' placeholder='Email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className='border p-2 rounded w-full mb-3' type='password' placeholder='Password' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {err && <p className='text-red-600 text-sm mb-2'>{err}</p>}
        <button className='bg-blue-700 text-white px-4 py-2 rounded w-full'>Sign In</button>
      </form>
    </div>
  )
}

export default EditorLogin


