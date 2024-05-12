import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter , Route , Link, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signout from './pages/Signout'
import Profie from './pages/Profie'
import About from './pages/About'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/signout" element={<Signout/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/profile" element={<Profie/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
