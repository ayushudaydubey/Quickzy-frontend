// store/Reducers/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Async thunk to add one item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        '/cart/add-to-cart',
        { productId },
        { withCredentials: true }
      );
      return res.data; // the updated cart document
    } catch (err) {
      // You can inspect err.response here
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],    // you might load these elsewhere
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items; // or whatever shape your backend returns
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
