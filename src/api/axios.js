import axios from 'axios';
//export const BASE_URL = 'https://think-fun.onrender.com';
export const BASE_URL = 'http://localhost:3002';
//export const BASE_URL = 'http://16.16.126.6:8080';

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});
