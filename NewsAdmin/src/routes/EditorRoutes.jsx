import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const EditorRoutes = () => {
  const [state, setState] = useState({ loading: true, allowed: false })

  useEffect(() => {
    let mounted = true
    axios
      .get(`${API}/user/getUser`, { withCredentials: true })
      .then((res) => {
        if (!mounted) return
        const role = res?.data?.user?.role
        const allowed = typeof role === 'string' && role.toLowerCase() === 'editor'
        setState({ loading: false, allowed })
      })
      .catch(() => {
        if (!mounted) return
        setState({ loading: false, allowed: false })
      })
    return () => {
      mounted = false
    }
  }, [])

  if (state.loading) return <div className='p-6'>Loading...</div>
  if (!state.allowed) return <Navigate to='/Editor/login' replace />
  return <Outlet />
}

export default EditorRoutes


