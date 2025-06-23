export const loadUser = createAsyncThunk("user/loadUser", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/me', { withCredentials: true });
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue("Not authenticated");
  }
});
