import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../../providers/AuthProviders";

const OrderNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [ifUnavailable, setIfUnavailable] = useState("Remove it from my order");
  const [loading, setLoading] = useState(false);

  // Fetch food details
  useEffect(() => {
    fetch(`${import.meta.env.VITE_NEXT_API_URL}/foods/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Food not found");
        return res.json();
      })
      .then((data) => setFood(data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch food!");
      });
  }, [id]);

  // Handle order
  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to place an order!");

    setLoading(true);

    const orderInfo = {
      foodId: id,
      foodName: food.name,
      price: food.price * quantity,
      quantity,
      buyerName: user.displayName,
      buyerEmail: user.email,
      specialInstructions,
      ifUnavailable,
      buyingDate: new Date().toISOString(),
      foodOwner: food.addedBy,
      image: food.image,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_NEXT_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
        body: JSON.stringify(orderInfo),
      });

      const data = await res.json();
      if (res.ok && data.insertedId) {
        toast.success("Order placed successfully!", { autoClose: 2000 });
        setQuantity(1);
        setSpecialInstructions("");
        setTimeout(() => navigate("/my-profile"), 2200); // delay so user sees toast
      } else {
        toast.error("Failed to place order!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!food) return <p className="text-center mt-10 text-neutral-400">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-16 bg-neutral-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden">
      <img
        src={food.image}
        alt={food.name}
        className="w-full h-52 object-cover rounded-t-3xl hover:scale-105 transition-transform duration-500"
      />
      <div className="p-5 space-y-3">
        <h2 className="text-2xl font-extrabold text-red-500">{food.name}</h2>
        <p className="text-xl font-bold text-pink-500">Tk {food.price * quantity}</p>
        <p className="text-neutral-300 text-sm">{food.description}</p>

        {/* Special Instructions */}
        <div>
          <label className="block text-neutral-200 font-medium text-sm mb-1">Special Instructions</label>
          <textarea
            placeholder="e.g. No mayo"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full border border-neutral-700 rounded-xl px-3 py-2 bg-neutral-800 text-neutral-200 focus:ring-2 focus:ring-red-500 outline-none text-sm transition"
          ></textarea>
        </div>

        {/* If unavailable */}
        <div>
          <label className="block text-neutral-200 font-medium text-sm mb-1">If this item is not available</label>
          <select
            value={ifUnavailable}
            onChange={(e) => setIfUnavailable(e.target.value)}
            className="w-full border border-neutral-700 rounded-xl px-3 py-2 bg-neutral-800 text-neutral-200 focus:ring-2 focus:ring-red-500 outline-none text-sm transition"
          >
            <option>Remove it from my order</option>
            <option>Keep it in my order</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="flex items-center space-x-3 mt-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700 shadow-md transition"
          >
            -
          </button>
          <span className="text-neutral-200 font-semibold text-lg">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700 shadow-md transition"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleOrder}
          disabled={loading}
          className={`w-full mt-4 text-white py-3 rounded-2xl font-semibold shadow-lg transition transform hover:scale-105 ${
            loading ? "bg-neutral-700 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default OrderNow;
