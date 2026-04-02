import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
import Tile from './Tile.jsx'
import Group from './Group.jsx'
import { useGetPuzzle, useSubmitGuess, usePersistedState} from '../hooks/swonnections';
import { setItem, getItem } from '../utils/localStorage.js';
import { set } from 'mongoose'

// Look at this tomorrow to understand how to persist state in local storage cleanly
// https://medium.com/@roman_j/mastering-state-persistence-with-local-storage-in-react-a-complete-guide-1cf3f56ab15c 

function App() {

  const { isLoading: isGettingPuzzle, puzzleNames, setPuzzleNames, currentTiles, setCurrentTiles } = useGetPuzzle();
  const { isLoading: isSubmitting, submitGuess } = useSubmitGuess();
  const MISTAKES_ALLOWED = 4;

  const isLoading = isGettingPuzzle || isSubmitting;
  const [selectedTiles, setSelectedTiles] = useState(new Set());
  const [correctGroups, setCorrectGroups] = usePersistedState("correctGroups", []); // array of objects that store the group name and difficulty of each correct group

  // Fisher-Yates shuffle algorithm
  const handleShuffleTiles = () => {
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

  const handleDeselectAll = () => {
    setSelectedTiles(new Set());
  }

  // check if this has been guesssed before
  // guess = array of guess ids
  const checkIfHappened = (guess) => {
    const sortedTarget = [...guess].sort();
    const prevGuesses = getItem('guesses');

    if (prevGuesses === undefined) return false;


    return prevGuesses.some(arr => {
    const sortedArr = [...arr].sort();
    return sortedArr.every((n, i) => n === sortedTarget[i]);
  });
  }
  
  const handleCorrect = (response) => {
    setCorrectGroups([...correctGroups, ({
       'difficulty': response.difficulty, 
       'groupName': response.label
      })]);

      setCurrentTiles(prev => prev.filter(id => !selectedTiles.has(id)));

      setSelectedTiles(new Set());
  }

  const handleIncorrect = () => {
    // alert('incorrect guess');
  }

  const handleSubmit = async () => {
    // TODO: handle not enough tiles selected
    if (selectedTiles.size !==4) return; // only submit if there are 4 tiles selected
    
    const response = await submitGuess({solution: [...selectedTiles]}); // use submit guess with selected tiles as array

    if (checkIfHappened([...selectedTiles])) {
      alert('You already guessed this!');
      return;
    }

    if(response.correct) {
      handleCorrect(response);
    }
    else {
      handleIncorrect();
    }

    let guesses = getItem('guesses');
    if (guesses != undefined) guesses.push([...selectedTiles]);
    else guesses = [[...selectedTiles]]; // this means it's the first guess

    setItem('guesses', guesses)

    console.log(response);
  }

  let numMistakesLeft = 4
  if (getItem('guesses') !== undefined) numMistakesLeft = MISTAKES_ALLOWED - getItem('guesses').length;
  

  return (
    <>
      <div className='game-container'>
        <div className='title'>
          <h1>Swonnections</h1>
        </div>
        <span className='description'>Create Groups of Four!</span>

        
        <div className='grid-container'>
          {correctGroups.map((group, index) =><Group difficulty={group.difficulty} groupName={group.groupName} />)}

          {!isLoading && puzzleNames
          .filter(tile => currentTiles.includes(tile.id))
          .map((tile, index) => (
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
          {[...Array(numMistakesLeft)].map((_, i) => 
          <div className='gray-circle'></div>)}
          
        </div>

        <div className='buttons'>
          <button onClick={handleShuffleTiles}>Shuffle</button>
          <button 
          onClick={handleDeselectAll}
          disabled={selectedTiles.size === 0}
          >Deselect All</button>
          <button 
          onClick={handleSubmit}
          disabled={selectedTiles.size < 4}
          >Submit</button>
        </div>

        <button onClick={() => localStorage.clear()}>reset</button>
      </div>
      { numMistakesLeft === 0 &&
      <div className='game-over'>
        <span>GAME OVER</span>
      </div> }
    </>
  )
}

export default App
