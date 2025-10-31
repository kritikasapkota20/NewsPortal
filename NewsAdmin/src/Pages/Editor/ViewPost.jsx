import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEdit, FaTrash, FaCalendar, FaUser, FaTag, FaEye, FaArrowLeft } from 'react-icons/fa'
import EditorNavbar from '../../components/EditorNavbar'
import EditorSidebar from '../../components/EditorSidebar'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const ViewPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/editor/posts`, { withCredentials: true })
      .then((res) => {
        const found = (res.data.posts || []).find((p) => p._id === id)
        if (!found) return setError('Not found or not assigned')
        setPost(found)
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!post) return
    if (post.status === 'published') return
    const ok = window.confirm('Delete this post?')
    if (!ok) return
    try {
      await axios.delete(`${API}/editor/posts/${post.category?._id || post.category}/${post._id}`, { withCredentials: true })
      navigate('/Editor/manage-posts')
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) return <div className='p-6'>Loading...</div>
  if (error) return <div className='p-6 text-red-600'>{error}</div>
  if (!post) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <EditorNavbar />
      <div className="flex">
        <EditorSidebar />
        <main className="flex-1">
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/Editor/manage-posts')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
                    <FaArrowLeft /> Back to My Posts
                  </button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <h1 className="text-2xl font-bold text-gray-900">Post Details</h1>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/Editor/edit-post/${post._id}`)}
                    disabled={post.status === 'published'}
                    className={`flex items-center gap-2 ${post.status === 'published' ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'} px-4 py-2 rounded-lg transition`}
                  >
                    <FaEdit /> Edit Post
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={post.status === 'published'}
                    className={`flex items-center gap-2 ${post.status === 'published' ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'} px-4 py-2 rounded-lg transition`}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2"><FaCalendar />{new Date(post.createdAt).toLocaleString()}</div>
                  {post.category && (
                    <div className="flex items-center gap-2"><FaTag /><span className="bg-gray-100 px-2 py-1 rounded-full">{post.category.name}</span></div>
                  )}
                  <div className="flex items-center gap-2">
                    <FaUser />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-500 bg-opacity-20' :
                      post.status === 'pending_review' ? 'bg-orange-500 bg-opacity-20' :
                      post.status === 'rejected' ? 'bg-red-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>

              {post.image && (
                <div className="px-6">
                  <img src={`${API.replace('/api','')}${post.image}`} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md" />
                </div>
              )}

              <div className="p-6">
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><FaCalendar className="text-blue-500" /><span>Created: {new Date(post.createdAt).toLocaleDateString()}</span></div>
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <div className="flex items-center gap-2"><FaCalendar className="text-green-500" /><span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span></div>
                    )}
                    <div className="flex items-center gap-2"><FaEye className="text-purple-500" /><span>Post ID: {post._id}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ViewPost


