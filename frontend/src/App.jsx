import './App.css'
import Navbar from './components/navbar/Navbar'
import Tab from './components/tab/Tab'
import Feed from './components/feed/Feed'
import Myposts from './components/myposts/Myposts'
import { useState } from 'react'

const App = () => {

  const [feedFlag, setFeedFlag] = useState(true)

  return (
    <>
      <div className='wrapper'>
        <Navbar/>
        <Tab feedFlag={feedFlag} setFeedFlag={setFeedFlag}/>
        <Feed/>
      </div>
    </>
  )
}

export default App
