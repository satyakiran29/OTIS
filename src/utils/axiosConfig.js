import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://otis-api.onrender.com/',
});

export default instance;
