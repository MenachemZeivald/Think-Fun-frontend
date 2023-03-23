import axios from 'axios';
//const BASE_URL = 'https://think-fun.cyclic.app';
const BASE_URL = 'http://localhost:3002';
// const BASE_URL = "http://localhost:3002";

export default axios.create({
	baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});
