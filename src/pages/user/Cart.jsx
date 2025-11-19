import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loadCart } from '../../store/Reducers/cartSlice';
import axiosInstance from '../../utils/axios';
import { Trash2, ShoppingBag, Loader2, ShoppingCart } from 'lucide-react';

// Helper function to extract image URL
const getImageUrl = (prod) => {
    if (!prod) return 'https://placehold.co/120x100/F0F0F0/333333?text=No+Image';

    let raw = '';

    if (Array.isArray(prod.images) && prod.images.length > 0) {
        const first = prod.images[0];

        if (typeof first === 'string') raw = first;
        if (typeof first === 'object') {
            raw =
                first.url ||
                first.secure_url ||
                first.path ||
                first.src ||
                first.publicUrl ||
                '';
        }
    }

    if (!raw && prod.image) {
        if (typeof prod.image === 'string') raw = prod.image;
        if (typeof prod.image === 'object') {
            raw =
                prod.image.url ||
                prod.image.secure_url ||
                prod.image.path ||
                prod.image.src ||
                prod.image.publicUrl ||
                '';
        }
    }

    return raw && String(raw).trim() !== ''
        ? raw
        : 'https://placehold.co/120x100/F0F0F0/333333?text=No+Image';
};

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector((state) => state.cart.items || []);
    const status = useSelector((state) => state.cart.status);
    const [loading, setLoading] = useState(false);

    // Load cart
    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                await dispatch(loadCart()).unwrap();
            } catch (err) {}
            if (mounted) setLoading(false);
        };

        load();
        return () => (mounted = false);
    }, [dispatch]);

    // Delete cart item
    const handleRemoveItem = async (productId) => {
        try {
            await axiosInstance.delete(`/cart/item/${productId}`, {
                withCredentials: true,
            });
            await dispatch(loadCart()).unwrap();
        } catch (err) {
            console.error('Failed to remove item', err);
        }
    };

    // Loading UI
    if (loading || status === 'loading') {
        return (
            <div className="max-w-6xl mx-auto px-6 py-20 text-center bg-neutral-50 min-h-screen">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-zinc-900" />
                <div className="mt-4 text-zinc-700">Loading Cart...</div>
            </div>
        );
    }

    // Empty cart UI
    if (!items || items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center bg-white min-h-[60vh]
">
                <div className="p-12 border-4 border-dashed border-neutral-200 rounded-xl">
                    <ShoppingBag className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                    <h2 className="text-3xl font-bold text-zinc-900 mb-2">
                        Your Cart is Empty
                    </h2>
                    <p className="text-zinc-600 mb-8">
                        Add products from our catalog to fill your cart.
                    </p>
                    <Link
                        to="/product"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-950 text-white font-medium rounded-lg uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-lg"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    // MAIN RENDER
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 bg-neutral-50 min-h-screen">
            <h1 className="text-4xl font-medium text-zinc-950 border-b border-neutral-300 pb-4 mb-8">
                Your Cart
            </h1>

            {/* List of items */}
            <div className="space-y-4">
                {[...items].reverse().map((it) => {
                    const p = it.productId || {};
                    const price = Number(p.price || 0);
                    const qty = Number(it.quantity || 1);
                    const imgSrc = getImageUrl(p);

                    return (
                        <div
                            key={p._id || Math.random()}
                            className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-xl shadow-lg border border-neutral-200"
                        >
                            {/* Image */}
                            <div className="w-full sm:w-32 h-24 flex-shrink-0 border border-neutral-200 rounded-lg overflow-hidden">
                                <img
                                    src={imgSrc}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        (e.currentTarget.src =
                                            'https://placehold.co/120x100/F0F0F0/333333?text=No+Image')
                                    }
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3
                                    onClick={() =>
                                        navigate(`/product/${p._id}`)
                                    }
                                    className="text-lg font-bold text-zinc-950 hover:text-zinc-700 cursor-pointer transition-colors truncate"
                                >
                                    {p.title}
                                </h3>
                                <p className="text-zinc-600 text-sm mt-1 mb-2 line-clamp-2">
                                    {p.description ||
                                        'No description available.'}
                                </p>

                                <div className="flex items-center gap-4 mt-2">
                                    <div className="text-base font-semibold text-zinc-950">
                                        Item Total: ₹
                                        {(price * qty).toFixed(2)}
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-700">
                                        <span className="mr-2 font-medium">
                                            Quantity:
                                        </span>
                                        <div className="font-bold">{qty}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-row sm:flex-col justify-end items-end sm:items-stretch gap-2 mt-3 sm:mt-0 sm:w-28">
                                <button
                                    onClick={() =>
                                        navigate(`/checkout/${p._id}`, {
                                            state: { quantity: qty },
                                        })
                                    }
                                    className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-zinc-950 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors shadow-md"
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={() => handleRemoveItem(p._id)}
                                    className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-300 pt-6">
                <button
                    onClick={() => navigate('/')}
                    className="order-2 sm:order-1 w-full sm:w-auto mt-4 sm:mt-0 px-6 py-3 border border-zinc-950 text-zinc-950 font-medium rounded-lg uppercase tracking-wider hover:bg-zinc-100 transition-colors"
                >
                    Continue Shopping
                </button>

                <div className="order-1 sm:order-2 text-base text-zinc-600 p-2 bg-white rounded-lg shadow-inner">
                    <span className="font-semibold">Note:</span> Purchase is
                    done per item using the 'Buy Now' button.
                </div>
            </div>
        </div>
    );
};

export default Cart;
