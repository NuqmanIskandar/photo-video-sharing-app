import './App.css'
import Navbar from './components/navbar/Navbar'
import Tab from './components/tab/Tab'
import Feed from './components/feed/Feed'
import Myposts from './components/myposts/Myposts'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import { AuthProvider } from './components/AuthContext/AuthContext'
import { useState } from 'react'

const App = () => {

  const [feedFlag, setFeedFlag] = useState(true)
  const [loginTab, setLoginTab] = useState(false)
  const [signupTab, setSignupTab] = useState(false)
  const [user, setUser] = useState("")

  const toggleLogin = () => {
    setLoginTab(!loginTab)
    setSignupTab(false)
  }

  const toggleSignup = () => {
    setSignupTab(!signupTab)
    setLoginTab(false)
  }

  return (
    <AuthProvider>
      <div className='wrapper'>
        <Navbar toggleLogin={toggleLogin} toggleSignup={toggleSignup} user={user}/>
        <Tab feedFlag={feedFlag} setFeedFlag={setFeedFlag}/>
        <Feed/>
      </div>
      {loginTab && <Login toggleLogin={toggleLogin} toggleSignup={toggleSignup} user={user} setUser={setUser}/>}
      {signupTab && <Signup toggleSignup={toggleSignup}/>}
    </AuthProvider>
  )
}

export default App
