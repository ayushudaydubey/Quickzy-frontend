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

// New: load user's cart
export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/cart', { withCredentials: true });
      return res.data; // { items: [...] }
    } catch (err) {
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
        // backend might return { items: [...] } or an array directly
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.items = payload;
        } else if (payload && Array.isArray(payload.items)) {
          state.items = payload.items;
        } else {
          state.items = [];
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// add loadCart handling
cartSlice.reducer = cartSlice.reducer || cartSlice;
// attach extra reducers for loadCart
cartSlice.extraReducers = cartSlice.extraReducers || function(){};

// We need to recreate the slice's reducer mapping for loadCart; safer to handle via the store's reducer already exported above.

// Instead, we will augment the reducer by wrapping it to handle loadCart actions
const originalReducer = cartSlice.reducer;
const enhancedReducer = (state, action) => {
  // reuse original reducer behavior first
  const nextState = originalReducer(state, action);
  // handle loadCart actions
  switch (action.type) {
    case `${loadCart.pending}`:
      return { ...nextState, status: 'loading' };
    case `${loadCart.fulfilled}`: {
      const payload = action.payload;
      let items = [];
      if (Array.isArray(payload)) items = payload;
      else if (payload && Array.isArray(payload.items)) items = payload.items;
      return { ...nextState, status: 'succeeded', items };
    }
    case `${loadCart.rejected}`:
      return { ...nextState, status: 'failed', error: action.payload };
    default:
      return nextState;
  }
};

export default enhancedReducer;
