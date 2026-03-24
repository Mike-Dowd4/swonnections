import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
import Tile from './Tile.jsx'
import { useGetPuzzle } from '../hooks/swonnections';
import { set } from 'mongoose'

function App() {

  const { isLoading, puzzleNames, setPuzzleNames } = useGetPuzzle();
  const [selectedTiles, setSelectedTiles] = useState(new Set());


  // Fisher-Yates shuffle algorithm
  const shuffleTiles = () => {
    setPuzzleNames(prev => {
      const arr = [...prev];

      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr;
    });
  };

  const selectTile = (id) => {
    setSelectedTiles(prev => {
      const next = new Set(prev);

      if (next.has(id)) { // if tile is already selected, deselect it
      next.delete(id);
      return next;
      }

      if (next.size >= 4) return prev; // if there are 4 tiles selected, do not select

      next.add(id); // otherwise select the tile
      return next;
    });

  }

  const deselectAll = () => {
    setSelectedTiles(new Set());
  }


  return (
    <>
      <div className='game-container'>
        <div className='title'>
          <h1>Swonnections</h1>
        </div>
        <span className='description'>Create Groups of Four!</span>
        <div className='grid-container'>
          {!isLoading && puzzleNames.map((tile, index) => (
            <Tile
              onClick={() => selectTile(tile.id)}
              name={tile.Name}
              id={tile.id}
              selected={selectedTiles.has(tile.id)}
              key={tile.id}
            />
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
          <button onClick={shuffleTiles}>Shuffle</button>
          <button onClick={deselectAll}>Deselect All</button>
          <button>Submit</button>
        </div>
      </div>
    </>
  )
}

export default App
