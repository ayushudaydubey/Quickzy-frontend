import React from 'react'
import { Link } from 'react-router-dom'

const Cart = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-center">
      <h2 className="text-2xl font-semibold mb-4">Cart removed</h2>
      <p className="text-zinc-600 mb-6">The Add-to-Cart / Checkout feature has been removed. You can save items to your Wishlist instead.</p>
      <Link to="/user/wishlist" className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-lg">Go to Wishlist</Link>
    </div>
  )
}

export default Cart
