const basePath = "https://swordle.org/api/swonnections";
const localBasePath = "http://localhost:8080/api/swonnections";

export const api = {
    get: (endpoint) => fetch(`${basePath}/${endpoint}`),
    post: (endpoint, data) => 
        fetch(`${basePath}/${endpoint}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data && JSON.stringify(data),
        })
}