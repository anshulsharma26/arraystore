import axios from 'axios';

const API = axios.create({
  baseURL: '/api/products',
  withCredentials: true,
});

export const fetchProducts = (params) => API.get('/', { params });
export const fetchProductById = (id) => API.get(`/${id}`);
export const fetchCategories = () => API.get('/categories');
export const fetchBrands = () => API.get('/brands');
export const createProduct = (data) => API.post('/', data);
export const updateProduct = (id, data) => API.put(`/${id}`, data);
export const deleteProduct = (id) => API.delete(`/${id}`);
