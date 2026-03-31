export function setItem(key, value) {
    try {
        localStorage.setItem(JSON.stringify(value));
    } catch(error) {
        console.error("Error saving to localStorage: ", error);
    }
}

export function getItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    } catch(error) {
        console.error("Error reading from localStorage: ", error);
    }
}