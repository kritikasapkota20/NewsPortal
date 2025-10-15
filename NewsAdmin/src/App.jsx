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
                  <Route path="comments" element={<Comments />} />
                  <Route path="profile" element={<Profile />}/>
                  <Route path="view-post/:category/:id" element={<ViewPosts />} />
                  <Route path="edit-post/:category/:id" element={<EditPost />} />
                  <Route path="manage-categories" element={<ManageCategories />} />
                  

                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App