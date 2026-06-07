import axios from 'axios';

const API = axios.create({
  baseURL: '/api/cart',
  withCredentials: true,
});

export const fetchCart = () => API.get('/');
export const syncCartAPI = (cartItems) => API.post('/sync', { cartItems });
export const updateCartAPI = (cartItems) => API.put('/', { cartItems });
export const clearCartAPI = () => API.delete('/');
