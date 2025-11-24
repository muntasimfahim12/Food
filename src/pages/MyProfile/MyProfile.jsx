import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthProviders";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(""); // currently canceling order ID

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_NEXT_API_URL}/orders?email=${user.email}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmDelete) return;

    try {
      setCanceling(id);
      const res = await fetch(`${import.meta.env.VITE_NEXT_API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Order cancelled successfully!");
        setOrders((prev) => prev.filter((order) => order._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order.");
    } finally {
      setCanceling("");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 font-medium">
        Loading your orders...
      </p>
    );

  if (orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500 font-medium">
        You have no orders yet.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">My Orders</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          className="p-4 border rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          {/* Food Image */}
          <img
            src={order.image || "https://via.placeholder.com/100"}
            alt={order.foodName}
            className="w-24 h-24 rounded-lg object-cover"
          />

          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-lg">{order.foodName}</h3>
            <p>Quantity: {order.quantity || 1}</p>
            <p>Price: Tk {order.price}</p>
            <p>
              Special Instructions: {order.specialInstructions || "None"}
            </p>
            <p>
              Order Date: {new Date(order.buyingDate).toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => handleDelete(order._id)}
            disabled={canceling === order._id}
            className={`px-4 py-2 rounded-lg text-white transition ${
              canceling === order._id
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {canceling === order._id ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyProfile;
