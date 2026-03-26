import { api } from "../adapters/api";

export const getPuzzle = () => api.get('getPuzzle').then((data) => data.json());

export const submitGuess = (guess) => api.post('submit', guess).then((data) => data.json());