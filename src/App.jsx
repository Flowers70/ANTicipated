import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Hero from './Pages/Hero';
import Journey from './Pages/Journey';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Hero/>
      <div className='line'></div>
      <Journey/>
    </>
  )
}

export default App
