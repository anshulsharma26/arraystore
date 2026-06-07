import axios from 'axios';

const API = axios.create({
  baseURL: '/api/orders',
  withCredentials: true,
});

export const createOrderAPI = (orderData) => API.post('/', orderData);
export const fetchMyOrders = () => API.get('/mine');
export const fetchOrderById = (id) => API.get(`/${id}`);
export const fetchAllOrders = () => API.get('/');
export const updateOrderStatusAPI = (id, status) => API.put(`/${id}/status`, { status });
