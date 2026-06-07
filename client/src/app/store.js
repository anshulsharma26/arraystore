import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/orders/orderSlice';


const cartPersistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  if (action.type?.startsWith('cart/')) {
    const state = store.getState();
    localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems));
  }
  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistMiddleware),
});

export default store;
