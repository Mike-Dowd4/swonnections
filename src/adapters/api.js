const basePath = "https://swordle.org/api/swonnections";

export const api = {
    get: (endpoint) => fetch(`${basePath}/${endpoint}`)
}