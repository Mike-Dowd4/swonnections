import {useEffect, useState} from 'react';
import * as swonnectionService from '../services/swonnections';

export const useGetPuzzle = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [puzzleNames, setPuzzleNames] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        swonnectionService.getPuzzle().then(({ swimmers }) => { // api responds with swimmers array, each swimmer has a Name prop 
            setPuzzleNames(swimmers);
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