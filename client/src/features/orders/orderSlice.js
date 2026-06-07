import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderAPI from './orderAPI';

export const createOrder = createAsyncThunk('orders/create', async (orderData, thunkAPI) => {
  try {
    const { data } = await orderAPI.createOrderAPI(orderData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Order creation failed');
  }
});

export const getMyOrders = createAsyncThunk('orders/getMine', async (_, thunkAPI) => {
  try {
    const { data } = await orderAPI.fetchMyOrders();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const getOrderById = createAsyncThunk('orders/getById', async (id, thunkAPI) => {
  try {
    const { data } = await orderAPI.fetchOrderById(id);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
  }
});

export const getAllOrders = createAsyncThunk('orders/getAll', async (_, thunkAPI) => {
  try {
    const { data } = await orderAPI.fetchAllOrders();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const { data } = await orderAPI.updateOrderStatusAPI(id, status);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    order: null,
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    clearOrder: (state) => { state.order = null; },
    resetOrderState: (state) => { state.isError = false; state.message = ''; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyOrders.pending, (state) => { state.isLoading = true; })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getOrderById.pending, (state) => { state.isLoading = true; })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllOrders.pending, (state) => { state.isLoading = true; })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
        if (state.order?._id === action.payload._id) state.order = action.payload;
      });
  },
});

export const { clearOrder, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
