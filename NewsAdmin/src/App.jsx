import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './Pages/AdminLogin'
import MainDashboard from "./Pages/MainDashboard"
import AdminLayout from './Components/AdminLayout'
import Profile from './Pages/Profile'
import ProtectedRoute from './Components/ProtectedRoute'
import CreatePost from './Pages/CreatePost'
import ManageUsers from './Pages/ManageUsers'
import ManagePosts from './Pages/ManagePosts'
import Comments from './Pages/Comments'
import EditPost from './Pages/EditPosts'
import ManageCategories from './Pages/ManageCategories'
import ViewPosts from './Pages/ViewPosts'
import ReviewPosts from './Pages/ReviewPosts'
import EditorRoutes from './routes/EditorRoutes'
import EditorViewPost from './Pages/Editor/ViewPost'
import EditorDashboard from './Pages/Editor/Dashboard'
import EditorManagePosts from './Pages/Editor/ManagePosts'
import EditorEditPost from './Pages/Editor/EditPost'
import EditorLogin from './Pages/Editor/Login'
import EditorCreatePost from './Pages/Editor/CreatePost'
import EditorProfile from './Pages/Editor/Profile'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Root route redirects to admin dashboard */}
          <Route path="/" element={<Navigate to="/Admin/dashboard" replace />} />
          
          {/* Admin Routes */}
          <Route path="/Admin/login" element={<AdminLogin />} />
          <Route path="/Admin/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<MainDashboard />} />
                  <Route path="create-post" element={<CreatePost />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="manage-posts" element={<ManagePosts />} />
                  <Route path="review-posts" element={<ReviewPosts />} />
                  <Route path="comments" element={<Comments />} />
                  <Route path="profile" element={<Profile />}/>
                  <Route path="view-post/:category/:id" element={<ViewPosts />} />
                  <Route path="edit-post/:category/:id" element={<EditPost />} />
                  <Route path="manage-categories" element={<ManageCategories />} />
                  

                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Editor Routes */}
          <Route path="/Editor/login" element={<EditorLogin />} />
          <Route element={<EditorRoutes />}>
            <Route path="/Editor/dashboard" element={<EditorDashboard />} />
            <Route path="/Editor/manage-posts" element={<EditorManagePosts />} />
            <Route path="/Editor/edit-post/:id" element={<EditorEditPost />} />
            <Route path="/Editor/view-post/:id" element={<EditorViewPost />} />
            <Route path="/Editor/create-post" element={<EditorCreatePost />} />
            <Route path="/Editor/profile" element={<EditorProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App