import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productAPI from './productAPI';

export const getProducts = createAsyncThunk('products/getAll', async (params, thunkAPI) => {
  try {
    const { data } = await productAPI.fetchProducts(params);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const getProductById = createAsyncThunk('products/getById', async (id, thunkAPI) => {
  try {
    const { data } = await productAPI.fetchProductById(id);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
  }
});

export const getCategories = createAsyncThunk('products/getCategories', async (_, thunkAPI) => {
  try {
    const { data } = await productAPI.fetchCategories();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
  }
});

export const getBrands = createAsyncThunk('products/getBrands', async (_, thunkAPI) => {
  try {
    const { data } = await productAPI.fetchBrands();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
  }
});

export const adminCreateProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
  try {
    const { data } = await productAPI.createProduct(productData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const adminUpdateProduct = createAsyncThunk('products/update', async ({ id, productData }, thunkAPI) => {
  try {
    const { data } = await productAPI.updateProduct(id, productData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const adminDeleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    await productAPI.deleteProduct(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    categories: [],
    brands: [],
    page: 1,
    pages: 1,
    total: 0,
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    clearProduct: (state) => {
      state.product = null;
    },
    resetProductState: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => { state.isLoading = true; })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProductById.pending, (state) => { state.isLoading = true; })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
        if (state.product?._id === action.payload._id) state.product = action.payload;
      })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearProduct, resetProductState } = productSlice.actions;
export default productSlice.reducer;
