import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import EditorNavbar from '../../components/EditorNavbar'
import EditorSidebar from '../../components/EditorSidebar'
import { MdManageSearch } from 'react-icons/md'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const ManagePosts = () => {
  const [posts, setPosts] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await axios.get(`${API}/editor/posts`, { withCredentials: true })
        setPosts(res.data.posts || [])
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load posts')
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchAssigned()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <EditorNavbar />
      <div className="flex">
        <EditorSidebar />
        <main className="p-6 flex-1">
          <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3">
            <MdManageSearch className="text-primary text-2xl" />
            <h1 className="text-2xl font-semibold text-gray-800">Manage My Posts</h1>
            <div className="ml-auto flex gap-2 items-center">
              <input
                className="border p-2 rounded w-64"
                placeholder="Search title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h3>
                <p className="text-gray-600 mb-6">Do you really want to delete this post?</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</button>
                  <button
                    onClick={async () => {
                      if (!selectedPost) return
                      try {
                        await axios.delete(`${API}/editor/posts/${selectedPost.category?._id || selectedPost.category}/${selectedPost._id}`, { withCredentials: true })
                        setPosts((prev) => prev.filter((x) => x._id !== selectedPost._id))
                      } catch {}
                      setShowConfirm(false)
                      setSelectedPost(null)
                    }}
                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading && <div className="p-4">Loading...</div>}
          {error && <div className="p-4 text-red-600">{error}</div>}

          {Object.entries(
            posts
              .filter((p) => p.title?.toLowerCase().includes(query.toLowerCase()))
              .filter((p) => (status ? p.status === status : true))
              .reduce((acc, p) => {
                const key = p.category?.name || 'Uncategorized'
                if (!acc[key]) acc[key] = []
                acc[key].push(p)
                return acc
              }, {})
          ).map(([cat, items]) => (
            <div key={cat} className="mb-8 bg-white rounded-xl shadow-md overflow-hidden min-w-fit">
              <h2 className="text-xl font-bold p-4 bg-gray-600 text-white">{cat}</h2>
              <div className="overflow-x-auto">
                <table className="min-w-max divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-4 text-left font-semibold text-gray-600">Title</th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-600">Image</th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-600">Created Date</th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {items.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition duration-200">
                        <td className="px-4 py-4 text-gray-900 w-[300px]">{p.title}</td>
                        <td className="px-4 py-4">
                          <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden">
                            {p.image ? (
                              <img src={`${API.replace('/api','')}${p.image}`} alt={p.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{new Date(p.createdAt || p.updatedAt).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            p.status === 'published' ? 'bg-green-100 text-green-700' : 
                            p.status === 'pending_review' ? 'bg-orange-100 text-orange-700' : 
                            p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{p.status || 'draft'}</span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium">
                          <div className="flex flex-wrap items-center gap-3">
                            {p.status !== 'published' ? (
                              <Link to={`/Editor/edit-post/${p._id}`}>
                                <div className="relative group flex justify-center">
                                  <span className="absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Edit</span>
                                  <button className="min-w-[30px] bg-secondary text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                </div>
                              </Link>
                            ) : (
                              <div className="relative group flex justify-center">
                                <span className="absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Edit</span>
                                <button disabled className="min-w-[30px] bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2.5 rounded-lg flex items-center justify-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                    </div>
                            )}

                            <Link to={`/Editor/view-post/${p._id}`}>
                              <div className="relative group flex justify-center">
                                <span className="absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">View</span>
                                <button className="min-w-[30px] bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                    </div>
                            </Link>

                            <div className="relative group flex justify-center">
                              <span className="absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Delete</span>
                      <button
                                disabled={p.status === 'published'}
                                onClick={() => { setSelectedPost(p); setShowConfirm(true); }}
                                className={`min-w-[30px] ${p.status === 'published' ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-opacity-90'} text-white px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                      </button>
                    </div>
                  </div>
                        </td>
                      </tr>
                ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {!loading && !error && posts.length === 0 && (
            <div className="text-slate-500">No posts assigned yet.</div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ManagePosts


