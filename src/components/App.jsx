import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import JSConfetti from "js-confetti";
import '../styles/App.css'
import Tile from './Tile.jsx'
import Group from './Group.jsx'
import GameOver from './GameOver.jsx';
import ShowMessage from './ShowMessage.jsx'
import { useGetPuzzle, useSubmitGuess, usePersistedState, useDailyReset} from '../hooks/swonnections';
import { setItem, getItem } from '../utils/localStorage.js';


function App() {

  const { isLoading: isGettingPuzzle, puzzleNames, setPuzzleNames, currentTiles, setCurrentTiles } = useGetPuzzle();
  const { isLoading: isSubmitting, submitGuess } = useSubmitGuess();

  const isLoading = isGettingPuzzle || isSubmitting;
  const [selectedTiles, setSelectedTiles] = useState(new Set());
  const [guesses, setGuesses] = usePersistedState('guesses', []);
  const [correctGroups, setCorrectGroups] = usePersistedState("correctGroups", []); // array of objects that store the group name and difficulty of each correct group
  const [numMistakes, setNumMistakes] = usePersistedState('numMistakes', 4);
  const [correctGuesses, setCorrectGuesses] = usePersistedState('correctGuesses', 0);
  const [showBoard, setShowBoard] = useState(false);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [disabled, setDisabled] = useState(false); // Allows easy disabling of buttons

  const gameOver = (numMistakes === 0 || correctGuesses === 4);


  const resetGame = () => {
    setGuesses([])
    setSelectedTiles(new Set());
    setCorrectGroups([]);
    setNumMistakes(4);
    setCurrentTiles(puzzleNames.map((swimmer) => swimmer.id));
    setCorrectGuesses(0);
  }
  useDailyReset(resetGame);


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

  const displayMessage = (message) => {
    setMessage(message);
    setShowMessage(true);
    setDisabled(true)

    setTimeout(() => {
      setShowMessage(false);
      setDisabled(false);
    }, 3000);
  }

  const selectTile = (id) => {
    if (gameOver) return;

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

    if (guesses.length === 0) return false;


    return guesses.some(arr => {
    const sortedArr = [...arr].sort();
    return sortedArr.every((n, i) => n === sortedTarget[i]);
  });
  }



  // TODO: When player loses, the correct board should show
  // Need to add backend endpoint to get the correct puzzle
  // Eventually make this a nice animation
  const showCorrectBoard = (solution) => {
    const newGroups = [];
    for (let i = 0; i < solution.length; i += 4) {
      newGroups.push({
        difficulty: solution[i].group_difficulty,
        groupName: solution[i].group_label,
        names: solution.slice(i, i + 4).map(s => s.Name)
      });
    }
    setCorrectGroups(newGroups);
    setCurrentTiles([]);
    return;
  }
  
  const handleCorrect = (response) => {
    const names = [...selectedTiles].map(
      id => puzzleNames.find(p => p.id === id)?.Name
    );

    setCorrectGroups([...correctGroups, ({
       'difficulty': response.difficulty, 
       'groupName': response.label,
       'names': names
    })]);


    if(response.correctGuesses === 4) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti();
    }

    setCurrentTiles(prev => prev.filter(id => !selectedTiles.has(id)));
    setCorrectGuesses(response.correctGuesses);

    setSelectedTiles(new Set());
  }

  const handleIncorrect = (response) => {

    // TODO: Need to add shaking animation here so users know it is incorrect
    setShakeAnimation(true)
    setDisabled(true);
    setTimeout(() => {
      setNumMistakes(response.numMistakes);
      setDisabled(false);
      if(response.oneAway) displayMessage("One Away...");
      if(response.lost) {
        showCorrectBoard(response.solution);
      }
    }, 1000);

    // alert('incorrect guess');
  }

  const handleSubmit = async () => {
    if (selectedTiles.size !==4) return; // only submit if there are 4 tiles selected
    if (showMessage) return; // Don't submit if there is a message up (so it doesn't cause flickering)

    if (checkIfHappened([...selectedTiles])) {
      displayMessage("You already guessed this!");
      return;
    }
    const response = await submitGuess({solution: [...selectedTiles], numMistakes: numMistakes, correctGuesses: correctGuesses}); // use submit guess with selected tiles as array
    if(response.correct) {
      handleCorrect(response);
    }
    else {
      handleIncorrect(response);
    }
    setGuesses([...guesses, [...selectedTiles]]);
    
  }


  return (
    <>
      <GameOver win={correctGuesses===4} gameOver={gameOver} showBoard={showBoard} toggleBoard={setShowBoard} /> 
      <div className='game-container' onClick={() => {if (gameOver) setShowBoard(prev => !prev);}}>

        <div className='title'>
          <h1>Swonnections</h1>
        </div>
        <span className='description'>Create Groups of Four!</span>

          <ShowMessage message={message} show={showMessage} />
        
        <div className='grid-container'>
          { isGettingPuzzle ? (
            <div>Loading...</div>
          ) : (
          <>
            {correctGroups.map((group, index) =>
            <Group 
            difficulty={group.difficulty} 
            groupName={group.groupName}
            names={group.names}
            key={index}
            />)}

            { !gameOver && puzzleNames
            .filter(tile => currentTiles.includes(tile.id))
            .map((tile, index) => (
              <Tile
                onClick={() => selectTile(tile.id)}
                name={tile.Name}
                id={tile.id}
                selected={selectedTiles.has(tile.id)}
                key={tile.id}
                shake={shakeAnimation}
                setShakeAnimation={setShakeAnimation}
                disabled={gameOver}
              />
            ))}
          </>
          )}
        </div>
        <div className='mistakes-remaining'>
          <span className='mistakes'>Mistakes Remaining: </span>
          {[...Array(numMistakes)].map((_, idx) => 
          <div className='gray-circle' key={idx}></div>)}
          
        </div>

        <div className='buttons'>
          <button 
          onClick={handleShuffleTiles}
          disabled={numMistakes === 0 || disabled}>
            Shuffle</button>
          <button 
          onClick={handleDeselectAll}
          disabled={selectedTiles.size === 0 || numMistakes === 0 || disabled}>
            Deselect All
          </button>
          <button 
          onClick={handleSubmit}
          disabled={selectedTiles.size < 4 || numMistakes === 0 || disabled}>
            Submit
          </button>
        </div>
        
      </div>
      {/* { gameOver && 
        <button onClick={() => setShowBoard(false)}>Message</button>
        } */}

      {/* This is for dev */}
      {/* <button onClick={() => {
        resetGame() }
        }>reset</button> */}
    </>
  )
}

export default App
