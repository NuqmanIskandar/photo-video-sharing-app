import './App.css'
import Navbar from './components/navbar/Navbar'
import Tab from './components/tab/Tab'
import Feed from './components/feed/Feed'
import Myposts from './components/myposts/Myposts'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import Upload from "./components/Upload/Upload"
import Delete from "./components/delete/Delete"
import { AuthProvider } from './components/AuthContext/AuthContext'
import { useState, useEffect } from 'react'

const App = () => {

  const [feedFlag, setFeedFlag] = useState(true)
  const [loginTab, setLoginTab] = useState(false)
  const [signupTab, setSignupTab] = useState(false)
  const [uploadTab, setUploadTab] = useState(false)
  const [deleteTab, setDeleteTab] = useState(false)
  const [user, setUser] = useState("")

  const [feedPosts, setFeedPosts] = useState([])
  const [posts, setPosts] = useState([])

  const [postDelete, setPostDelete] = useState("")

  const toggleLogin = () => {
    setLoginTab(!loginTab)
    setSignupTab(false)
    setUploadTab(false)
    setDeleteTab(false)
  }

  const toggleSignup = () => {
    setSignupTab(!signupTab)
    setLoginTab(false)
    setUploadTab(false)
    setDeleteTab(false)
  }

  const toggleUpload = () => {
    setUploadTab(!uploadTab)
    setSignupTab(false)
    setLoginTab(false)
    setDeleteTab(false)
  }

  const toggleDelete = () => {
    setDeleteTab(!deleteTab)
    setUploadTab(false)
    setSignupTab(false)
    setLoginTab(false)
  }

  useEffect(() => {
    const anyTabOpen = loginTab || signupTab || uploadTab || deleteTab
    document.body.classList.toggle('active-modal', anyTabOpen)
    return () => document.body.classList.remove('active-modal')
  }, [loginTab, signupTab, uploadTab, deleteTab])

  // For Feed
  const fetchFeed = async () => {
    const response = await fetch("http://0.0.0.0:3000/feed")
    const data = await response.json()
    setFeedPosts(data)
  }

  // For My Posts
  const fetchMyPosts = async () => {
    try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3000/posts", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        if (!res.ok) {
            const errData = await res.json()
            throw new Error(errData.detail || "Failed to load user's posts")
        }
        const data = await res.json()
        setPosts(data)
    } catch (err) {
        console.error("error:", err)
    }
  }

  const handleUploadSuccess = async () => {
    await fetchMyPosts()
    await fetchFeed()
  }

  useEffect(() => {
    setPostDelete("")
    if (user) {
      fetchMyPosts()
    } else {
      setPosts([])
    }
    fetchFeed()
  }, [user])

  return (
    <AuthProvider>
      <div className='wrapper'>
        <Navbar toggleLogin={toggleLogin} toggleSignup={toggleSignup} user={user} setUser={setUser} setFeedFlag={setFeedFlag}/>
        <Tab feedFlag={feedFlag} setFeedFlag={setFeedFlag} toggleUpload={toggleUpload}/>
        {feedFlag ? ( <Feed posts={feedPosts}/> ) : ( <Myposts posts={posts} toggleDelete={toggleDelete} setPostDelete={setPostDelete}/> )}
      </div>
      {loginTab && <Login toggleLogin={toggleLogin} toggleSignup={toggleSignup}/>}
      {signupTab && <Signup toggleSignup={toggleSignup}/>}
      {uploadTab && <Upload toggleUpload={toggleUpload} onUploadSuccess={handleUploadSuccess}/>}
      {deleteTab && <Delete toggleDelete={toggleDelete} postDelete={postDelete} onDeleteSuccess={handleUploadSuccess}/>} {/* can just use the same as upload since it just fetch (maybe find a better name later) */}
    </AuthProvider>
  )
}

export default App
