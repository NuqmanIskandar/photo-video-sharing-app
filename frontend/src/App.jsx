import './App.css'
import Navbar from './components/navbar/Navbar'
import Tab from './components/tab/Tab'
import Feed from './components/feed/Feed'
import Myposts from './components/myposts/Myposts'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import Upload from "./components/Upload/Upload"
import Delete from "./components/delete/Delete"
import Loading from "./components/Loading/Loading"
import { API_BASE_URL } from "./config"
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

  const [isMainLoading, setIsMainLoading] = useState(false)
  const [isUploadLoading, setIsUploadLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isSignupLoading, setSignupLoading] = useState(false)

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
    const response = await fetch(`${API_BASE_URL}/feed`)
    const data = await response.json()
    setFeedPosts(data)
  }

  // For My Posts
  const fetchMyPosts = async () => {
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_BASE_URL}/posts`, {
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

  const loadScreen = async () => {
    setIsMainLoading(true)
    setPostDelete("")
    if (user) {
      await fetchMyPosts()
    } else {
      setPosts([])
    }
    await fetchFeed()
    await setIsMainLoading(false)
  }

  useEffect(() => {
    loadScreen()
  }, [user])

  return (
    <AuthProvider>
      <div className='wrapper'>
        <Navbar
          toggleLogin={toggleLogin}
          toggleSignup={toggleSignup}
          user={user}
          setUser={setUser}
          setFeedFlag={setFeedFlag}
          setIsLoginLoading={setIsLoginLoading}
          setIsSignupLoading={setSignupLoading}
        />
        <Tab feedFlag={feedFlag} setFeedFlag={setFeedFlag} toggleUpload={toggleUpload}/>

        {isMainLoading ? ( <Loading/> ) : 
          feedFlag ? (
            <Feed posts={feedPosts}/>
          ) 
          : (
            <Myposts
              posts={posts}
              toggleDelete={toggleDelete}
              setPostDelete={setPostDelete}
            />
          )
        }
        
      </div>

      {loginTab &&
      <Login
        toggleLogin={toggleLogin}
        toggleSignup={toggleSignup}
        isLoading={isLoginLoading}
        setIsLoading={setIsLoginLoading}
      />
      }

      {signupTab &&
      <Signup
        toggleSignup={toggleSignup}
        isLoading={isSignupLoading}
        setIsLoading={setSignupLoading}
      />
      }

      {uploadTab &&
        <Upload
          toggleUpload={toggleUpload}
          onUploadSuccess={handleUploadSuccess}
          isLoading={isUploadLoading}
          setIsLoading={setIsUploadLoading}
        />
      }
      
      {deleteTab &&
        <Delete 
          toggleDelete={toggleDelete}
          postDelete={postDelete}
          onDeleteSuccess={handleUploadSuccess}
          isLoading={isDeleteLoading}
          setIsLoading={setIsDeleteLoading}
        />
      }
    </AuthProvider>
  )
}

export default App
