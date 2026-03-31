import {useEffect, useState} from 'react';
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

    useEffect(() => {
        setIsLoading(true);
        swonnectionService.getPuzzle().then(({ swimmers }) => { // api responds with swimmers array, each swimmer has a Name prop 
            const shuffledSwimmers = shuffleArray(swimmers); // shuffle the swimmers array
            setPuzzleNames(shuffledSwimmers);
            setIsLoading(false);
        });
    }, []);

    return { isLoading, puzzleNames, setPuzzleNames };
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