import { useEffect, useState } from 'react'
import axios from 'axios'
import EditorNavbar from '../../components/EditorNavbar'
import EditorSidebar from '../../components/EditorSidebar'
import { IoIosCreate } from 'react-icons/io'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const CreatePost = () => {
  const [form, setForm] = useState({ title: '', content: '', image: null, category: '', subCategory: '', isHeadNews: false, isMainNews: false, status: 'draft' })
  const [categories, setCategories] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    axios.get(`${API}/categories`).then((r) => {
      if (r.data?.success) setCategories(r.data.categories || [])
    }).catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const data = new FormData()
      data.append('title', form.title)
      data.append('content', form.content)
      data.append('category', form.category)
      data.append('subCategory', form.subCategory)
      if (form.image) data.append('file', form.image)
      data.append('isHeadNews', String(form.isHeadNews))
      data.append('isMainNews', String(form.isMainNews))
      data.append('status', form.status)
      // Create via editor endpoint so it's auto-assigned to the current editor
      await axios.post(`${API}/editor/posts`, data, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('Created successfully')
      setForm({ title: '', content: '', image: null, category: '', subCategory: '', isHeadNews: false, isMainNews: false, status: 'draft' })
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Create failed')
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <EditorNavbar />
      <div className='flex'>
        <EditorSidebar />
        <main className='p-6 flex-1 flex flex-col items-center'>
          <div className='bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3 max-w-2xl w-full'>
            <IoIosCreate className='text-blue-700 text-2xl' />
            <h1 className='text-2xl font-semibold text-gray-800'>Create Post</h1>
          </div>
          <form onSubmit={submit} className='space-y-3 max-w-2xl bg-white p-6 rounded-lg shadow-2xl w-full'>
            <input className='border p-2 rounded w-full' placeholder='Title' value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className='border p-2 rounded w-full h-64' placeholder='Content' value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <div>
              <label className='block text-base font-bold text-gray-700 mb-2'>Category:</label>
              <select className='border p-2 rounded w-full' value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: '' })}>
                <option value=''>Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {!!(categories.find(c=>c._id===form.category)?.subCategories?.length) && (
              <div>
                <label className='block text-base font-bold text-gray-700 mb-2'>Sub Category:</label>
                <select className='border p-2 rounded w-full' value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })}>
                  <option value=''>Select Sub Category</option>
                  {categories.find(c=>c._id===form.category)?.subCategories.map((sc) => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>
            )}
            <div className='flex items-center gap-6'>
              <label className='flex items-center gap-2'><input type='checkbox' checked={form.isHeadNews} onChange={(e)=>setForm({...form, isHeadNews: e.target.checked})}/> Mark as Head News</label>
              <label className='flex items-center gap-2'><input type='checkbox' checked={form.isMainNews} onChange={(e)=>setForm({...form, isMainNews: e.target.checked})}/> Mark as Featured News</label>
              <select className='border p-2 rounded' value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})}>
                <option value='draft'>Draft</option>
                <option value='pending_review'>Submit for Review</option>
              </select>
            </div>
            <input type='file' onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
            {msg && <div className='text-sm text-slate-600'>{msg}</div>}
            <button className='bg-blue-700 text-white px-4 py-2 rounded'>Create</button>
          </form>
        </main>
      </div>
    </div>
  )
}

export default CreatePost


