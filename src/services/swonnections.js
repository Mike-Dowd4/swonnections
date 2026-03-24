import { api } from "../adapters/api";

export const getPuzzle = (puzzleId) => api.get(puzzleId).then((data) => data.json());

