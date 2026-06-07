import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartAPI from './cartAPI';


export const syncCart = createAsyncThunk('cart/sync', async (_, thunkAPI) => {
  try {
    const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const { data } = await cartAPI.syncCartAPI(localCart);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Cart sync failed');
  }
});


const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: loadCartFromStorage(),
    isLoading: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, variant, quantity, name, image, price } = action.payload;
      const existingIndex = state.cartItems.findIndex(
        (item) => item.product === product && item.variant?.sku === variant?.sku
      );

      if (existingIndex > -1) {
        state.cartItems[existingIndex].quantity += quantity;
      } else {
        state.cartItems.push({ product, variant, quantity, name, image, price });
      }
    },
    removeFromCart: (state, action) => {
      const { product, sku } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => !(item.product === product && item.variant?.sku === sku)
      );
    },
    updateQuantity: (state, action) => {
      const { product, sku, quantity } = action.payload;
      const item = state.cartItems.find(
        (item) => item.product === product && item.variant?.sku === sku
      );
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCart.pending, (state) => { state.isLoading = true; })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (Array.isArray(action.payload)) {
          state.cartItems = action.payload.map((item) => {
            const product = item.product;
            const variantData = product?.variants?.find(v => v.sku === item.variant?.sku);
            return {
              product: product?._id || item.product,
              variant: item.variant,
              quantity: item.quantity,
              name: product?.name || '',
              image: product?.images?.[0] || '',
              price: variantData?.price || product?.basePrice || 0,
            };
          });
        }
      })
      .addCase(syncCart.rejected, (state) => { state.isLoading = false; });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
