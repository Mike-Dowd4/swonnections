import {useEffect, useState, useLayoutEffect} from 'react';
import {getItem, setItem} from '../utils/localStorage'
import * as swonnectionService from '../services/swonnections';

//fisher-yates shuffle algorithm
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }

  return array;
}

export const useGetPuzzle = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [puzzleNames, setPuzzleNames] = useState([]);
    const [currentTiles, setCurrentTiles] = usePersistedState('currentTiles', []);

    useEffect(() => {
        setIsLoading(true);
        swonnectionService.getPuzzle().then(({ swimmers }) => { // api responds with swimmers array, each swimmer has a Name and id
            const shuffledSwimmers = shuffleArray(swimmers); 
            setPuzzleNames(shuffledSwimmers);
            
            if(getItem('currentTiles') === undefined || getItem('currentTiles').length === 0) {
                setCurrentTiles(shuffledSwimmers.map((swimmer) => swimmer.id));
            }
            setIsLoading(false);
        });
    }, []);

    return { isLoading, puzzleNames, setPuzzleNames, currentTiles, setCurrentTiles };
}

export const useSubmitGuess = () => {
    const [isLoading, setIsLoading] = useState(false);

    const submitGuess = (guess) => {
        setIsLoading(true);
        return swonnectionService.submitGuess(guess).then((response) => {
            setIsLoading(false);
            return response;
        });
    }

    return { isLoading, submitGuess };
}

// Persists board state in localStorage
// sets state to the value in localStorage at 'key' if it exists, otherwise sets it to defaultValue
// Whenever the state changes, it updates the value in localStorage at 'key' to the new state value
export const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        return getItem(key) ?? defaultValue;
    });

    useEffect(() => {
        setItem(key,state);
    }, [key, state]);

    return [state, setState]
}