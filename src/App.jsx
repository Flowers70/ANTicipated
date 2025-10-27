import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import ProtectedRoute from './Components/ProtectedRoute';
import Header from './Components/Header';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/sign-in" element={<SignIn/>} />
          <Route path="/test" element={<ProtectedRoute><Header/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
