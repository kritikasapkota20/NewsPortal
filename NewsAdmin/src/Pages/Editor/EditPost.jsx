import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import EditorNavbar from '../../components/EditorNavbar'
import EditorSidebar from '../../components/EditorSidebar'
import { IoIosCreate } from 'react-icons/io'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [categories, setCategories] = useState([])
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const isPublished = (post?.status === 'published')

  useEffect(() => {
    axios.get(`${API}/categories`).then((r) => {
      if (r.data?.success) setCategories(r.data.categories || [])
    }).catch(() => {})
    axios.get(`${API}/editor/posts/${id}`, { withCredentials: true })
      .then((res) => {
        if (!res.data?.post) return setErr('Not found or not assigned')
        setPost(res.data.post)
      })
      .catch((e) => setErr(e?.response?.data?.message || 'Internal server error'))
  }, [id])

const save = async () => {
  try {
    setErr('')
    setMsg('Saving...')

    const data = new FormData()
    data.append('title', post.title)
    data.append('content', post.content)
    data.append('subCategory', post.subCategory || '')
    data.append('isHeadNews', String(!!post.isHeadNews))
    data.append('isMainNews', String(!!post.isMainNews))
    if (post._newFile) data.append('file', post._newFile)

    const categoryId = post.category?._id || post.category
    const res = await axios.patch(`${API}/editor/posts/${categoryId}/${id}`, data, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data?.success !== false) {
      // ✅ Show success message first
      setMsg('✅ Post saved successfully! Redirecting...')
      console.log('Saved OK, navigating...')

      // ✅ Delay navigation 1.5s for user feedback
      setTimeout(() => {
        navigate('/Editor/manage-posts')
      }, 1500)
    } else {
      setErr('Unexpected server response')
    }
  } catch (e) {
    console.error('Save failed:', e)
    setErr(e?.response?.data?.message || 'Save failed')
  }
}




  const submitForReview = async () => {
    try {
      setMsg('')
      await axios.patch(`${API}/editor/posts/${id}/submit`, {}, { withCredentials: true })
      setMsg('Post submitted for review')
      navigate('/Editor/manage-posts')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Submit failed')
    }
  }

  if (err) return <div className='p-6 text-red-600'>{err}</div>
  if (!post) return <div className='p-6'>Loading...</div>

  return (
    <div className='min-h-screen bg-slate-50'>
      <EditorNavbar />
      <div className='flex'>
        <EditorSidebar />
        <main className='p-6 flex-1 flex flex-col items-center'>
          <div className='bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3 max-w-2xl w-full'>
            <IoIosCreate className='text-blue-700 text-2xl' />
            <h1 className='text-2xl font-semibold text-gray-800'>Edit Post</h1>
          </div>
          <div className='space-y-3 max-w-2xl bg-white p-6 rounded-lg shadow-2xl w-full'>
            <input disabled={isPublished} className='border p-2 rounded w-full disabled:bg-gray-100' placeholder='Title' value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
            <textarea disabled={isPublished} className='border p-2 rounded w-full h-64 disabled:bg-gray-100' placeholder='Content' value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })} />
            <div>
              <label className='block text-base font-bold text-gray-700 mb-2'>Category:</label>
              <select disabled={isPublished} className='border p-2 rounded w-full disabled:bg-gray-100' value={post.category?._id || ''} onChange={()=>{}}>
                <option value=''>Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {!!(categories.find(c=>c._id===post.category?._id)?.subCategories?.length) && (
              <div>
                <label className='block text-base font-bold text-gray-700 mb-2'>Sub Category:</label>
                <select disabled={isPublished} className='border p-2 rounded w-full disabled:bg-gray-100' value={post.subCategory || ''} onChange={(e) => setPost({ ...post, subCategory: e.target.value })}>
                  <option value=''>Select Sub Category</option>
                  {categories.find(c=>c._id===post.category?._id)?.subCategories.map((sc) => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>
            )}
            <div className='flex items-center gap-6'>
              <label className='flex items-center gap-2'><input disabled={isPublished} type='checkbox' checked={!!post.isHeadNews} onChange={(e)=>setPost({...post, isHeadNews: e.target.checked})}/> Mark as Head News</label>
              <label className='flex items-center gap-2'><input disabled={isPublished} type='checkbox' checked={!!post.isMainNews} onChange={(e)=>setPost({...post, isMainNews: e.target.checked})}/> Mark as Featured News</label>
            </div>
            {post.image && (
              <div className='flex items-center gap-3'>
                <img src={`${API.replace('/api','')}${post.image}`} alt="Current" className='w-20 h-20 object-cover rounded' />
                <span className='text-sm text-gray-600'>Current image</span>
              </div>
            )}
            {post.status !== 'published' && (
              <div>
                <label className='block text-base font-bold text-gray-700 mb-2'>Replace Image:</label>
                <input type='file' onChange={(e)=> setPost({ ...post, _newFile: e.target.files?.[0] })} />
              </div>
            )}
            {msg && <div className='text-sm text-green-600'>{msg}</div>}
            <div className='flex gap-3'>
              <button disabled={isPublished} onClick={save} className={`px-4 py-2 rounded ${isPublished ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-700 text-white hover:bg-blue-800'}`}>Save Changes</button>
              <button onClick={() => navigate('/Editor/manage-posts')} className='px-4 py-2 rounded border hover:bg-gray-50'>Cancel</button>
            </div>

            {/* Status controls for editor: allow switching between Draft and Pending Review when not published */}
            {post.status !== 'published' && (
              <div className='mt-3 flex gap-3'>
                <button
                  onClick={async ()=>{ try { if (!window.confirm('Submit this post for review?')) return; setMsg(''); const r = await axios.patch(`${API}/editor/posts/${id}/submit`, {}, { withCredentials: true }); setPost(prev=>({ ...prev, status: r.data?.post?.status || 'pending_review' })); setMsg('Submitted for review'); } catch(e){ const m = e?.response?.data?.message || 'Submit failed'; setErr(m); alert(m); } }}
                  className='bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700'
                >
                  Submit for Review
                </button>
                <button
                  onClick={async ()=>{ try { if (!window.confirm('Save changes and mark as draft?')) return; setMsg(''); const fd = new FormData(); fd.append('title', post.title); fd.append('content', post.content); fd.append('subCategory', post.subCategory || ''); if (post._newFile) fd.append('file', post._newFile); fd.append('isHeadNews', String(!!post.isHeadNews)); fd.append('isMainNews', String(!!post.isMainNews)); const categoryId = post.category?._id || post.category; await axios.patch(`${API}/editor/posts/${categoryId}/${id}`, fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }); const d = await axios.patch(`${API}/editor/posts/${id}/draft`, {}, { withCredentials: true }); setPost(prev=>({ ...prev, status: d.data?.post?.status || 'draft' })); setMsg('Saved as draft'); } catch(e){ const m = e?.response?.data?.message || 'Save failed'; setErr(m); alert(m); } }}
                  className='bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700'
                >
                  Save as Draft
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default EditPost


