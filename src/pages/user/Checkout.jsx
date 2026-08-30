import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import RazorpayButton from "../../components/RazorpayButton";
import Loader from "../../components/Loader";
import { validateCheckoutDetails, getMissingFieldsMessage } from "../../utils/checkoutValidation";
import {
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  User,
  Tag,
  AlertCircle,
  Sparkles,
  Lock,
  ChevronRight,
  Building2
} from "lucide-react";

// Robust image URL helper
const getImageUrl = (prod) => {
  if (!prod) return "https://placehold.co/160x160/F4F4F5/71717A?text=No+Image";
  let raw = "";
  if (Array.isArray(prod.images) && prod.images.length > 0) {
    const first = prod.images[0];
    if (typeof first === "string") raw = first;
    if (typeof first === "object" && first) {
      raw = first.url || first.secure_url || first.path || first.src || first.publicUrl || "";
    }
  }
  if (!raw && prod.image) {
    if (typeof prod.image === "string") raw = prod.image;
    if (typeof prod.image === "object" && prod.image) {
      raw = prod.image.url || prod.image.secure_url || prod.image.path || prod.image.src || prod.image.publicUrl || "";
    }
  }
  return raw && String(raw).trim() !== "" ? raw : "https://placehold.co/160x160/F4F4F5/71717A?text=No+Image";
};

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(
    Number.isInteger(location.state?.quantity) && location.state.quantity > 0
      ? location.state.quantity
      : 1
  );

  const [submitting, setSubmitting] = useState(false);
  const [detailsValidation, setDetailsValidation] = useState({ isValid: false, missingFields: [] });

  // Promo code states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  /* ------------------- Dynamic ETA Date ------------------- */
  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  /* ------------------- Load product ------------------- */
  useEffect(() => {
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  /* ------------------- Load user ------------------- */
  useEffect(() => {
    axiosInstance
      .get("/profile", { withCredentials: true })
      .then((res) => {
        const userData = res.data.user || res.data;
        setUser(userData);
        const validation = validateCheckoutDetails(userData);
        setDetailsValidation(validation);
      })
      .catch(() => {
        toast.error("Please log in first");
        navigate("/login");
      });
  }, [navigate]);

  /* ------------------- Price Calculations ------------------- */
  const rawSubtotal = product ? Number(product.price) * quantity : 0;
  const deliveryCharge = 0; // Free
  const originalDeliveryCharge = 99;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = (rawSubtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "flat") {
      discountAmount = Math.min(appliedCoupon.value, rawSubtotal);
    }
  }

  const finalTotal = Math.max(0, rawSubtotal - discountAmount + deliveryCharge).toFixed(2);
  const totalSavings = (discountAmount + originalDeliveryCharge).toFixed(2);

  /* ------------------- Coupon Handler ------------------- */
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError("");

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (code === "QUICKZY50") {
      setAppliedCoupon({ code: "QUICKZY50", value: 50, type: "flat" });
      setCouponCode("QUICKZY50");
      toast.success("Coupon QUICKZY50 applied! ₹50 OFF");
    } else if (code === "SAVE10" || code === "FIRST10") {
      setAppliedCoupon({ code, value: 10, type: "percentage" });
      setCouponCode(code);
      toast.success(`Coupon ${code} applied! 10% OFF`);
    } else if (code === "FREESHIP") {
      toast.info("Free shipping is already included on all orders!");
    } else {
      setCouponError("Invalid coupon code. Try QUICKZY50 or SAVE10");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon removed");
  };

  /* ------------------- Razorpay success ------------------- */
  const handlePaymentSuccess = async (r) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(
        "/cart/create",
        {
          productId: id,
          quantity,
          customer: {
            name: user.username,
            address: user.address,
            phone: user.mobile || user.phone,
          },
          total: Number(finalTotal),
          payment: {
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          },
        },
        { withCredentials: true }
      );

      const createdOrder = res.data?.order;
      let message = "Payment successful! Order placed.";
      if (createdOrder && createdOrder.expectedDeliveryDate) {
        const eta = new Date(createdOrder.expectedDeliveryDate);
        message += ` Estimated delivery: ${eta.toDateString()}`;
      } else {
        message += ` Estimated delivery by ${getEstimatedDeliveryDate()}`;
      }

      toast.success(message);
      setTimeout(() => navigate("/orders"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save order details. Please contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------- Handle incomplete details ------------------- */
  const handleIncompleteDetails = () => {
    const message = getMissingFieldsMessage(detailsValidation.missingFields);
    toast.error(message);
    setTimeout(() => {
      navigate("/profile");
    }, 1800);
  };

  /* ------------------- Razorpay error ------------------- */
  const handlePaymentError = () => {
    toast.error("Payment failed or cancelled.");
  };

  /* ------------------- Loading state ------------------- */
  if (!product || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center bg-zinc-50">
        <Loader text="Preparing your secure checkout..." />
      </div>
    );
  }

  const productImage = getImageUrl(product);
  const userFullAddress = [user.address, user.city, user.state, user.zipCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* ================= HEADER & STEPPER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1 px-2 rounded-lg hover:bg-zinc-100 -ml-2 mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Product</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900">
              Final Checkout
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              Review your delivery details and order summary before paying.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium self-start md:self-auto bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[11px] font-medium text-zinc-600">1</span>
              <span>Cart</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <div className="flex items-center gap-1.5 text-zinc-900 font-medium">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[11px] font-medium">2</span>
              <span>Checkout</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[11px] font-medium text-zinc-400">3</span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN 2-COLUMN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: DETAILS (7 Cols) ================= */}
          <div className="lg:col-span-7 space-y-6">

            {/* Incomplete Details Warning Banner */}
            {!detailsValidation.isValid && (
              <div className="bg-zinc-100 border border-zinc-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-zinc-900 shadow-xs">
                <AlertCircle className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <h4 className="text-sm font-semibold text-zinc-950">
                    Shipping Details Incomplete
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {getMissingFieldsMessage(detailsValidation.missingFields)}
                  </p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-black underline underline-offset-2 cursor-pointer"
                  >
                    Update shipping address in profile →
                  </button>
                </div>
              </div>
            )}

            {/* --- 1. Order Summary Card --- */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
                  <h2 className="text-base font-semibold text-zinc-900">
                    Order Item Details
                  </h2>
                </div>
                <span className="text-xs font-medium text-zinc-600 bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 rounded-md">
                  {quantity} {quantity === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Product Image */}
                <div className="relative group shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                  <img
                    src={productImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/160x160/F4F4F5/71717A?text=No+Image";
                    }}
                  />
                </div>

                {/* Product Information */}
                <div className="flex-1 min-w-0 space-y-2.5">
                  <div>
                    {product.category && (
                      <span className="inline-block text-[11px] font-medium uppercase tracking-wider text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md mb-1.5">
                        {product.category}
                      </span>
                    )}
                    <h3 className="text-base font-medium text-zinc-900 line-clamp-2 leading-snug">
                      {product.title}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-semibold text-zinc-900">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-zinc-500 font-normal">
                      per unit
                    </span>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-normal text-zinc-600">Qty:</span>
                      <div className="inline-flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-0.5">
                        <button
                          type="button"
                          className={`w-7 h-7 flex items-center justify-center rounded-lg text-zinc-700 font-medium transition ${
                            quantity <= 1
                              ? "text-zinc-300 cursor-not-allowed"
                              : "hover:bg-white hover:shadow-xs active:scale-95 cursor-pointer"
                          }`}
                          onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-zinc-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-700 font-medium hover:bg-white hover:shadow-xs active:scale-95 transition cursor-pointer"
                          onClick={() => {
                            if (quantity >= 10) {
                              toast.warn("Maximum 10 units allowed per order");
                              return;
                            }
                            setQuantity((n) => n + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-500 block">Subtotal:</span>
                      <span className="text-sm font-semibold text-zinc-900">
                        ₹{(Number(product.price) * quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Express Delivery Badge */}
              <div className="bg-zinc-50 rounded-xl p-3 sm:p-3.5 border border-zinc-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-800 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-zinc-900">
                    Quickzy Express Delivery:{" "}
                  </span>
                  <span className="text-zinc-600">
                    Guaranteed delivery by{" "}
                    <span className="text-zinc-900 font-medium">
                      {getEstimatedDeliveryDate()}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* --- 2. Delivery Address Card --- */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-semibold text-zinc-900">
                    Delivery Address
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-800 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Edit Address</span>
                </button>
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-900">
                      {user.username || "Recipient Name"}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-700 bg-zinc-200 border border-zinc-300 px-2 py-0.5 rounded-md">
                      Home / Primary
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-zinc-700 flex items-start gap-2 pt-1">
                  <Building2 className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-normal">
                    {userFullAddress || (
                      <span className="text-zinc-500 italic">
                        No address provided. Please click "Edit Address" to add your full shipping address.
                      </span>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-zinc-200 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>
                      <strong className="font-medium text-zinc-800">Phone:</strong> {user.mobile || user.phone || <span className="text-zinc-400">Missing</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="truncate">
                      <strong className="font-medium text-zinc-800">Email:</strong> {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- 3. Trust & Value Proportions Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-white rounded-xl p-3.5 border border-zinc-200 flex items-center gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-medium text-zinc-900">100% Genuine</h5>
                  <p className="text-[11px] text-zinc-500">Verified quality guarantee</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-zinc-200 flex items-center gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-medium text-zinc-900">3 Days Delivery</h5>
                  <p className="text-[11px] text-zinc-500">Estimated within 3 days</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-zinc-200 flex items-center gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-medium text-zinc-900">7 Days Return</h5>
                  <p className="text-[11px] text-zinc-500">Hassle-free replacements</p>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: SUMMARY & PAY (5 Cols) ================= */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">

            {/* --- Promo / Coupon Box --- */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-zinc-700" />
                <h3 className="text-sm font-semibold text-zinc-900">
                  Apply Promo Code
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-zinc-100 border border-zinc-300 rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-zinc-700" />
                    <div>
                      <span className="text-xs font-medium text-zinc-900">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[11px] text-zinc-600">
                        {appliedCoupon.type === "flat"
                          ? `₹${appliedCoupon.value} discount applied`
                          : `${appliedCoupon.value}% discount applied`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs font-medium text-zinc-700 hover:text-black underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      className="flex-1 uppercase bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-xl transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-zinc-600 font-normal">{couponError}</p>
                  )}
                  
                  {/* Quick Coupon Suggestions */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-zinc-400">Available:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon("QUICKZY50")}
                      className="text-[11px] font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 px-2 py-0.5 rounded-md transition cursor-pointer border border-zinc-200"
                    >
                      QUICKZY50 (₹50 OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon("SAVE10")}
                      className="text-[11px] font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 px-2 py-0.5 rounded-md transition cursor-pointer border border-zinc-200"
                    >
                      SAVE10 (10% OFF)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- Price Breakdown Card --- */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-5">
              <h3 className="text-base font-semibold text-zinc-900 pb-3 border-b border-zinc-100">
                Payment Summary
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-zinc-600">
                  <span>Price ({quantity} item{quantity > 1 ? "s" : ""})</span>
                  <span className="font-medium text-zinc-900">
                    ₹{rawSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-600">
                  <span>Delivery Charges</span>
                  <div className="flex items-center gap-1.5">
                    <span className="line-through text-zinc-400 text-xs">₹99.00</span>
                    <span className="text-zinc-800 font-medium bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-xs">
                      FREE
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-zinc-600">
                  <span>Secured Packaging & Handling</span>
                  <div className="flex items-center gap-1.5">
                    <span className="line-through text-zinc-400 text-xs">₹29.00</span>
                    <span className="text-zinc-800 font-medium bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-xs">
                      FREE
                    </span>
                  </div>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-zinc-900 font-normal">
                    <span>
                      Coupon Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-medium">
                      −₹{discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-dashed border-zinc-200">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 block">
                        Total Amount
                      </span>
                      <span className="text-[11px] text-zinc-500 font-normal">
                        (Inclusive of all applicable taxes)
                      </span>
                    </div>
                    <span className="text-xl font-semibold text-zinc-950 tracking-tight">
                      ₹{Number(finalTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Savings Pill */}
                <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-2.5 text-center">
                  <p className="text-xs font-normal text-zinc-800">
                    You will save ₹{Number(totalSavings).toLocaleString("en-IN", { minimumFractionDigits: 2 })} on this order
                  </p>
                </div>
              </div>

              {/* Payment Action Button */}
              <div className="pt-2 space-y-3">
                <RazorpayButton
                  amount={Number(finalTotal)}
                  currency="INR"
                  meta={{
                    productId: id,
                    quantity,
                    customer: {
                      name: user.username,
                      address: user.address,
                      phone: user.mobile || user.phone,
                      email: user.email,
                    },
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={submitting || !detailsValidation.isValid}
                  onDisabledClick={!detailsValidation.isValid ? handleIncompleteDetails : null}
                  loading={submitting}
                />

                <div className="flex flex-col items-center justify-center gap-1.5 text-zinc-400 text-[11px]">
                  <div className="flex items-center gap-1.5 font-normal text-zinc-500">
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Safe & Secure 256-bit Razorpay Gateway</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] pt-1">
                    <span>UPI</span>
                    <span>•</span>
                    <span>Cards</span>
                    <span>•</span>
                    <span>NetBanking</span>
                    <span>•</span>
                    <span>Wallets</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
