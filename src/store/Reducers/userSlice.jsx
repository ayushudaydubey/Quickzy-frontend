import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "../Reducers/userApi";


const initialState = {
  user: null,
  token: null,
  error: null,
  status: 'idle',
};


export const loadUser = () => (dispatch) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  if (token) {
    try {
      const user = JSON.parse(atob(token.split('.')[1])); 
      dispatch(setUser({ user, token }));
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
};


export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials); 
      document.cookie = `token=${data.token}; path=/;`;
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Register
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerAPI(userData); // returns { user, token }
      document.cookie = `token=${data.token}; path=/;`;
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
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
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'success';
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
        state.token = action.payload.token;
        state.status = 'success';
        state.error = null;
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
        state.token = action.payload.token;
        state.status = 'success';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});


export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
