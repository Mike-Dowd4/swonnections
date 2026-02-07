import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
import Tile from './Tile.jsx'

function App() {

  return (
    <>
      <div className='game-container'>
        <div className='title'>
          <h1>Swonnections</h1>
        </div>
        <span className='description'>Create Groups of Four!</span>
        <div className='grid-container'>
          {Array.from({ length: 16 }, (_, index) => (
            <Tile key={index} />
          ))}
        </div>
        <div className='mistakes-remaining'>
          <span className='mistakes'>Mistakes Remaining: </span>
          <div className='gray-circle'></div>
          <div className='gray-circle'></div>
          <div className='gray-circle'></div>
          <div className='gray-circle'></div>
        </div>

        <div className='buttons'>
          <button>Shuffle</button>
          <button>Deselect All</button>
          <button>Submit</button>
        </div>
      </div>
    </>
  )
}

export default App
