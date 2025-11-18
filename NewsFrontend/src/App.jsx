import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import AuthForm from './Pages/AuthForm'
import Post from './Pages/Post'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
// import Samachardetails from './Components/Samachardetails'
// import Artha from './Pages/Artha'
// import ArthaDetails from './Components/ArthaDetails'
// import Bichar from './Pages/Bichar'
// import BicharDetails from './Components/BicharDetails'
// import HealthDetails from './Components/HealthDetails'
import Entertainment from './Pages/Entertainment'
// import EntertainmentDetails from './Pages/EntertainmentDetails'
import AdminLogin from './Pages/Admin/AdminLogin'
import MainDashboard from "./Pages/Admin/MainDashboard"
import AdminLayout from './Components/Admin/AdminLayout'
import Profile from './Pages/Admin/Profile'
import ProtectedRoute from './Components/Admin/ProtectedRoute'
import CreatePost from './Pages/Admin/CreatePost'
import ManageUsers from './Pages/Admin/ManageUsers'
import ManagePosts from './Pages/Admin/ManagePosts'
import Comments from './Pages/Admin/Comments'
import EditPost from './Pages/Admin/EditPosts'
import UnicodeConverter from './Pages/Unicode-Converter'
// import Samachardetails from './Components/Samachardetails'
import Health from './Pages/Health'
import Sports from './Pages/Sports'
import SubCategoryPosts from './Pages/SubCategoryPosts'
import DynamicDetails from './Components/DynamicDetails'
import Verify from './Pages/Verify'
import UserProfile from './Pages/UserProfile'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AuthForm" element={<AuthForm />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/profile" element={<><UserProfile /></>} />
          {/* <Route path="/economy/" element={<><Navbar /><Samachar /><Footer /></>} />
          <Route path="/SamacharDetails/:title" element={<><Navbar /><Samachardetails /><Footer /></>} />
          <Route path="/Artha/" element={<><Navbar /><Artha /><Footer /></>} />
          <Route path="/ArthaDetails/:title" element={<><Navbar /><ArthaDetails /><Footer /></>} />
          <Route path="/Bichar/" element={<><Navbar /><Bichar /><Footer /></>} />
          <Route path="/BicharDetails/:title" element={<><Navbar /><BicharDetails /><Footer /></>} />
          <Route path="/Health/" element={<><Navbar /><Swasthya /><Footer /></>} />
          <Route path="/SwasthyaDetails/:id" element={<><Navbar /><SwasthyaDetails /><Footer /></>} />
          <Route path="/Entertainment" element={<><Navbar /><Manoranjan /><Footer /></>} /> */}
          {/* Special Category Pages */}
<Route path="/category/entertainment" element={<><Navbar /><Entertainment /><Footer /></>} />
{/* <Route path="/entertainmentDetails/:id/:slug" element={<><Navbar /><EntertainmentDetails /> <Footer/></>} /> */}

<Route path="/category/health" element={<><Navbar /><Health /><Footer /></>} />
{/* <Route path="/healthDetails/:id/:slug" element={<> <Navbar /> <HealthDetails /> <Footer /></> } /> */}

<Route path="/category/sports" element={<><Navbar /><Sports /><Footer /></>} /> 

{/* Dynamic Generic Category Page */}
<Route path="/category/:categorySlug/sub/:subSlug" element={<><Navbar /><SubCategoryPosts /><Footer /></>} />
<Route path="/category/:slug" element={<><Navbar /><Post /><Footer /></>} />
<Route path=":category/:id/:slug" element={<><Navbar /><DynamicDetails /><Footer /></>} />
          <Route path="/unicode-converter" element={<><Navbar /><UnicodeConverter /><Footer /></>} />



          
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
                  <Route path="edit-post/:category/:id" element={<EditPost />}/>
                 


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