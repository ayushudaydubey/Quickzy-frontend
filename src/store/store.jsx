import {configureStore}  from '@reduxjs/toolkit'
import userReducer  from '../store/Reducers/userSlice'
import cartReducer  from '../store/Reducers/cartSlice'
import wishlistReducer from '../store/Reducers/wishlistSlice'

export const store  = configureStore({
  reducer:{
    user : userReducer,
    cart  : cartReducer,
    wishlist: wishlistReducer,
  }
})
