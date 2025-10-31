import { Link, useLocation } from 'react-router-dom'

const EditorSidebar = () => {
  const { pathname } = useLocation()
  const item = (to, label) => (
    <Link to={to} className={`block px-4 py-2 rounded ${pathname === to ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}>{label}</Link>
  )
  return (
    <aside className="w-64 border-r bg-white p-4 space-y-2">
      {item('/Editor/dashboard', 'Dashboard')}
      {item('/Editor/manage-posts', 'My Posts')}
      {item('/Editor/create-post', 'Create Post')}
      {item('/Editor/profile', 'Profile')}
    </aside>
  )
}

export default EditorSidebar


