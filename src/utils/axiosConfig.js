import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '', // Falls back to relative path if not set (for proxy)
});

export default instance;
