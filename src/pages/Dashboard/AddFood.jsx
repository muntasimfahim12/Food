import { useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";

export default function AddFood() {
  const { user } = useContext(AuthContext);
  const [food, setFood] = useState({
    name: "",
    category: "food", // default to food
    price: "",
    image: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!food.name || !food.price || !food.image) return alert("Name, Price & Image required!");
    if (!user || (user.role !== "admin" && user.role !== "super admin")) {
      return alert("🚫 Only admin or super admin can add foods or drinks!");
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
        alert(`✅ ${food.category.charAt(0).toUpperCase() + food.category.slice(1)} added successfully!`);
        setFood({ name: "", category: "food", price: "", image: "", description: "" });
      } else alert("❌ Failed to add item");
    } catch (err) {
      console.error(err);
      alert("❌ Error adding item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-neutral-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-neutral-700 p-8 space-y-6 text-neutral-200"
      >
        <h2 className="text-3xl font-extrabold text-red-500 text-center mb-4">
          🍽️ Add New Item
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={food.name}
            onChange={handleChange}
            placeholder="Item Name *"
            className="w-full p-3 rounded-xl bg-neutral-700 border border-neutral-600 focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category select */}
            <select
              name="category"
              value={food.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-neutral-700 border border-neutral-600 focus:ring-2 focus:ring-red-500 outline-none text-neutral-100 transition"
            >
              <option value="food">Food</option>
              <option value="drink">Drink</option>
            </select>

            <input
              type="number"
              name="price"
              value={food.price}
              onChange={handleChange}
              placeholder="Price ($) *"
              className="w-full p-3 rounded-xl bg-neutral-700 border border-neutral-600 focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
              required
            />
          </div>

          <input
            type="text"
            name="image"
            value={food.image}
            onChange={handleChange}
            placeholder="Image URL *"
            className="w-full p-3 rounded-xl bg-neutral-700 border border-neutral-600 focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
            required
          />

          <textarea
            name="description"
            value={food.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 rounded-xl h-28 bg-neutral-700 border border-neutral-600 focus:ring-2 focus:ring-red-500 outline-none transition text-neutral-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-500 rounded-2xl font-semibold text-white hover:bg-red-600 transition transform hover:scale-105 shadow-lg"
        >
          {loading ? "Adding..." : `Add ${food.category.charAt(0).toUpperCase() + food.category.slice(1)}`}
        </button>
      </form>
    </div>
  );
}
