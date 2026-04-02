import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://otis-api.onrender.com/api',
});

export default instance;
