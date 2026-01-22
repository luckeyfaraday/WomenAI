const API_BASE_URL = import.meta.env.VITE_API_URL === undefined
    ? 'http://localhost:3000'
    : import.meta.env.VITE_API_URL;

export default API_BASE_URL;
