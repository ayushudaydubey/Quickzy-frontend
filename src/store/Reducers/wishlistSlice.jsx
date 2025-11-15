// wishlist feature removed — export a noop reducer to keep compatibility
const initialState = { items: [], status: 'idle', error: null };
export default function wishlistReducer(state = initialState, action) {
  return state;
}
