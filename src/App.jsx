import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Hero from './Pages/Hero';
import Journey from './Pages/Journey';
import Learning_Recap from './Pages/Learning_Recap';
import Skills from './Pages/Skills';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Hero/>
      <div className='line'></div>

      <Journey>
        <div>Watch iOS Video</div>
        <div>Visit iOS Web Page</div>
        <div>Do iOS Project</div>
        <div>Watch App Development Video</div>
        <div>Visit App Development Web Page</div>
      </Journey>
      <div className='line'></div>

      <Learning_Recap/>
      <div className='line'></div>

      <Skills/>
      <a className='attribution' href="https://www.vecteezy.com/free-vector/ant" target="_blank">Ant Vectors by Vecteezy</a>
    </>
  )
}

export default App
