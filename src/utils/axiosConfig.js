import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://otis-api.onrender.com/api', // Use deployed backend for production
    // baseURL: 'http://localhost:5000/api', // Use local backend for development
});

export default instance;
