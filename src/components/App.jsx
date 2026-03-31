import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
import Tile from './Tile.jsx'
import Group from './Group.jsx'
import { useGetPuzzle, useSubmitGuess } from '../hooks/swonnections';
import { set } from 'mongoose'

// Look at this tomorrow to understand how to persist state in local storage cleanly
// https://medium.com/@roman_j/mastering-state-persistence-with-local-storage-in-react-a-complete-guide-1cf3f56ab15c 

function App() {

  const { isLoading: isGettingPuzzle, puzzleNames, setPuzzleNames } = useGetPuzzle();
  const { isLoading: isSubmitting, submitGuess } = useSubmitGuess();

  const isLoading = isGettingPuzzle || isSubmitting;
  const [selectedTiles, setSelectedTiles] = useState(new Set());
  const [correctGroups, setCorrectGroups] = useState([]); // array of objects that store the group name and difficulty of each correct group


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

  const submit = async () => {
    // TODO: handle not enough tiles selected
    if (selectedTiles.size !==4) return; // only submit if there are 4 tiles selected
    
    const response = await submitGuess({solution: [...selectedTiles]}); // use submit guess with selected tiles as array


    if(response.correct) {
      setCorrectGroups([...correctGroups, ({
       'difficulty': response.difficulty, 
       'groupName': response.label
      })]);
    }
    console.log(response);
  }


  return (
    <>
      <div className='game-container'>
        <div className='title'>
          <h1>Swonnections</h1>
        </div>
        <span className='description'>Create Groups of Four!</span>

        {/* display correct groups here */}
        <Group difficulty='purple' groupName='NCAA Champions 2024'/>
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
          <button onClick={submit}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default App
