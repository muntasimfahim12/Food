import { useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";

export default function AddFood() {
  const { user } = useContext(AuthContext);

  const [food, setFood] = useState({
    name: "",
    category: "food",
    price: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!food.name.trim()) return alert("❗ Name is required");
    if (!food.price) return alert("❗ Price is required");
    if (!food.image.trim()) return alert("❗ Image URL is required");

    // Admin check
    if (!user || (user.role !== "admin" && user.role !== "super admin")) {
      return alert("🚫 Only admin or super admin can add items!");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access-token");

      const res = await fetch(`${import.meta.env.VITE_NEXT_API_URL}/foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(food),
      });

      const data = await res.json();

      if (data.insertedId) {
        alert(`✅ ${food.category.toUpperCase()} added successfully!`);
        setFood({
          name: "",
          category: "food",
          price: "",
          image: "",
          description: "",
        });
      } else {
        alert("❌ Failed to add item");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-neutral-800/80 backdrop-blur-lg rounded-3xl shadow-2xl 
        border border-neutral-700 p-8 space-y-6 text-neutral-200 animate-fadeIn"
      >
        <h2 className="text-3xl font-extrabold text-center text-red-500 mb-4">
          🍽️ Add New Item
        </h2>

        <div className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            value={food.name}
            onChange={handleChange}
            placeholder="Item Name *"
            className="w-full p-3 rounded-xl bg-neutral-700 border border-neutral-600 
            focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
          />

          {/* Category + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="category"
              value={food.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-neutral-700 border border-neutral-600 
              focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
            >
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              <option value="snacks">Snacks</option>
              <option value="dessert">Dessert</option>
            </select>

            <input
              type="number"
              name="price"
              value={food.price}
              onChange={handleChange}
              placeholder="Price ($) *"
              className="w-full p-3 rounded-xl bg-neutral-700 border border-neutral-600 
              focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
            />
          </div>

          {/* Image URL */}
          <input
            type="text"
            name="image"
            value={food.image}
            onChange={handleChange}
            placeholder="Image URL *"
            className="w-full p-3 rounded-xl bg-neutral-700 border border-neutral-600 
            focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
          />

          {/* Description */}
          <textarea
            name="description"
            value={food.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            className="w-full p-3 h-28 rounded-xl bg-neutral-700 border border-neutral-600 
            focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-500 rounded-2xl font-semibold text-white 
          hover:bg-red-600 transition transform hover:scale-105 shadow-lg disabled:opacity-60"
        >
          {loading ? "Adding..." : `Add ${food.category.toUpperCase()}`}
        </button>
      </form>
    </div>
  );
}
