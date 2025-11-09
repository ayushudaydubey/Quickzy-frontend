import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Load wishlist
export const loadWishlist = createAsyncThunk(
  'wishlist/loadWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/cart/wishlist', { withCredentials: true });
      return res.data; // { items: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/cart/wishlist/add', { productId }, { withCredentials: true });
      return res.data; // { items: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/cart/wishlist/${productId}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.items = payload;
        } else if (payload && Array.isArray(payload.items)) {
          state.items = payload.items;
        } else {
          state.items = [];
        }
      })
      .addCase(loadWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const payload = action.payload;
        if (Array.isArray(payload)) state.items = payload;
        else if (payload && Array.isArray(payload.items)) state.items = payload.items;
        else state.items = [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const payload = action.payload;
        if (Array.isArray(payload)) state.items = payload;
        else if (payload && Array.isArray(payload.items)) state.items = payload.items;
        else state.items = [];
      });
  },
});

export default wishlistSlice.reducer;
