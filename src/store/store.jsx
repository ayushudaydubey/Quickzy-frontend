import {configureStore}  from '@reduxjs/toolkit'
import userReducer  from '../store/Reducers/userSlice'
import cartReducer  from '../store/Reducers/cartSlice'
// wishlist removed

export const store  = configureStore({
  reducer:{
    user : userReducer,
    cart  : cartReducer,
    // wishlist removed
  }
})
