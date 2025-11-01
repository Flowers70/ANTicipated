import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import ProtectedRoute from './Components/ProtectedRoute';
import Setup from './Pages/Setup';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/sign-in" element={<SignIn/>} />
          <Route path="/setup" element={<Setup/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
