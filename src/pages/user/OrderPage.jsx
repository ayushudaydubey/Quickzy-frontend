import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import Loader from "../../components/Loader";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  ArrowRight
} from "lucide-react";

// Robust image URL extractor
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

const OrdersPage = () => {
  const [orders, setOrders] = useState(null); // null = loading

  useEffect(() => {
    axiosInstance
      .get("/cart/orders", { withCredentials: true })
      .then((res) => {
        const fetched = res.data.orders || [];
        setOrders(fetched);

        // Acknowledge any unnotified ETA changes
        fetched.forEach(async (o) => {
          if (o.adminSetEta && !o.etaNotified) {
            try {
              await axiosInstance.put(`/cart/orders/${o._id}/ack-eta`, {}, { withCredentials: true });
            } catch (e) {
              console.error("ack-eta error", e);
            }
          }
        });
      })
      .catch(() => setOrders([]));
  }, []);

  // Helper to render dynamic delivery text strictly according to status
  const renderStatusDeliveryInfo = (order) => {
    const status = order.status || "pending";
    const etaDate = order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate) : null;
    const deliveredDate = order.deliveredAt ? new Date(order.deliveredAt) : etaDate;
    const now = new Date();
    const daysDiff = etaDate ? Math.ceil((etaDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

    const formattedDeliveredDate = deliveredDate
      ? deliveredDate.toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

    const formattedEtaDate = etaDate
      ? etaDate.toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : null;

    switch (status) {
      case "delivered":
        return (
          <div className="text-xs sm:text-sm text-zinc-700 mt-2 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0" />
            <span>
              Delivered successfully {formattedDeliveredDate ? `on ${formattedDeliveredDate}` : ""}
            </span>
          </div>
        );

      case "out-for-delivery":
        return (
          <div className="text-xs sm:text-sm text-zinc-900 mt-2 flex items-center gap-1.5 font-medium">
            <Truck className="w-4 h-4 text-zinc-900 shrink-0 animate-bounce" />
            <span>Out for Delivery — Arriving at your address today!</span>
          </div>
        );

      case "shipped":
        return (
          <div className="text-xs sm:text-sm text-zinc-600 mt-2 flex items-center gap-1.5 flex-wrap">
            <Truck className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span>Package in transit</span>
            {formattedEtaDate && (
              <>
                <span className="text-zinc-300">•</span>
                <span>
                  Expected delivery: <strong className="font-medium text-zinc-900">{formattedEtaDate}</strong>
                  {daysDiff && daysDiff > 0 ? ` (in ${daysDiff} day${daysDiff > 1 ? "s" : ""})` : ""}
                </span>
              </>
            )}
          </div>
        );

      case "paid":
        return (
          <div className="text-xs sm:text-sm text-zinc-600 mt-2 flex items-center gap-1.5 flex-wrap">
            <Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span>Payment Confirmed — Preparing for dispatch</span>
            {formattedEtaDate && (
              <>
                <span className="text-zinc-300">•</span>
                <span>
                  Estimated delivery: <strong className="font-medium text-zinc-900">{formattedEtaDate}</strong>
                  {daysDiff && daysDiff > 0 ? ` (in ${daysDiff} day${daysDiff > 1 ? "s" : ""})` : ""}
                </span>
              </>
            )}
          </div>
        );

      case "failed":
        return (
          <div className="text-xs sm:text-sm text-zinc-800 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
            <span>Delivery attempt unsuccessful. We will re-attempt delivery shortly.</span>
          </div>
        );

      case "pending":
      default:
        return (
          <div className="text-xs sm:text-sm text-zinc-600 mt-2 flex items-center gap-1.5 flex-wrap">
            <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>Order Placed — Awaiting verification</span>
            {formattedEtaDate && (
              <>
                <span className="text-zinc-300">•</span>
                <span>
                  Estimated delivery: <strong className="font-medium text-zinc-800">{formattedEtaDate}</strong>
                  {daysDiff && daysDiff > 0 ? ` (in ${daysDiff} day${daysDiff > 1 ? "s" : ""})` : ""}
                </span>
              </>
            )}
          </div>
        );
    }
  };

  // Helper for status badge style
  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
            DELIVERED
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse"></span>
            OUT FOR DELIVERY
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-800 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-md">
            <Truck className="w-3 h-3 text-zinc-700" />
            SHIPPED
          </span>
        );
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-800 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-md">
            PAID
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 rounded-md">
            FAILED ATTEMPT
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-md">
            PENDING
          </span>
        );
    }
  };

  /* ------------------- LOADING ------------------- */
  if (orders === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-zinc-50">
        <Loader text="Loading your orders..." />
      </div>
    );
  }

  /* ------------------- NO ORDERS ------------------- */
  if (orders.length === 0) {
    return (
      <div className="min-h-[65vh] bg-zinc-50 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 mb-4 shadow-xs">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 mb-1">No Orders Placed Yet</h2>
        <p className="text-xs text-zinc-500 max-w-sm mb-6 font-normal">
          You have not placed any orders yet. Explore our curated collections and start shopping!
        </p>
        <Link
          to="/product"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-xl transition cursor-pointer"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  /* ------------------- ORDERS LIST ------------------- */
  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex items-baseline justify-between pb-4 border-b border-zinc-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Track and manage your recent purchases
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-600 bg-white border border-zinc-200 px-3 py-1 rounded-lg shadow-2xs">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        {/* Orders Stack */}
        <div className="space-y-4">
          {orders.map((order, i) => {
            const product = order.product;
            const productImage = getImageUrl(product);
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

            return (
              <div
                key={order._id || i}
                className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 sm:p-6 transition-all hover:border-zinc-300 space-y-4"
              >
                {/* Card Top Row: Order ID & Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span>Order #{String(order._id).slice(-8).toUpperCase()}</span>
                    {orderDate && (
                      <>
                        <span>•</span>
                        <span>Placed on {orderDate}</span>
                      </>
                    )}
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Main Product Info & Details */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  
                  {/* Product Thumbnail */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                    <img
                      src={productImage}
                      alt={product?.title || "Product"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/160x160/F4F4F5/71717A?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h2 className="text-base sm:text-lg font-medium text-zinc-900 leading-snug">
                      {product?.title || "Product"}
                    </h2>

                    {product?.description && (
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    )}

                    {/* Price / Qty / Total Grid */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 pt-1">
                      <div>
                        <span>Price: </span>
                        <strong className="font-medium text-zinc-900">
                          ₹{Number(product?.price || 0).toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <span className="text-zinc-300">•</span>
                      <div>
                        <span>Qty: </span>
                        <strong className="font-medium text-zinc-900">
                          {order.quantity || 1}
                        </strong>
                      </div>
                      <span className="text-zinc-300">•</span>
                      <div>
                        <span>Total Paid: </span>
                        <strong className="font-semibold text-zinc-950">
                          ₹{Number(order.total || (product?.price * (order.quantity || 1))).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    {/* Dynamic Delivery Status Info */}
                    <div className="pt-2 border-t border-zinc-100">
                      {renderStatusDeliveryInfo(order)}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default OrdersPage;
