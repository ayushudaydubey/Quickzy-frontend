
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, getUserProfileAPI } from "../Reducers/userApi";

const initialState = {
  user: null,
  token: null,
  error: null,
  status: 'idle',
};

// THUNK: LOGIN
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials);
      return data; // expects { user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// THUNK: REGISTER
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerAPI(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// THUNK: LOAD USER FROM COOKIE SESSION
export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUserProfileAPI();
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// SLICE
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token || null;
        state.status = 'success';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token || null;
        state.status = 'success';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // LOAD USER
      .addCase(loadUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'success';
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
