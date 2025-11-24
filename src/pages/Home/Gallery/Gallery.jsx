import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError("");
    let url = `${import.meta.env.VITE_NEXT_API_URL}/foods`;
    if (category !== "all") url += `?category=${category}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const filtered = category === "all" ? data : data.filter(item => item.category === category);
        setItems(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong while loading gallery.");
        setLoading(false);
      });
  }, [category]);

  if (loading) return <p className="text-center mt-20 text-neutral-400 font-medium">Loading gallery...</p>;
  if (error) return <p className="text-center mt-20 text-red-500 font-medium">{error}</p>;
  if (items.length === 0) return <p className="text-center mt-20 text-neutral-400 font-medium">No items available.</p>;

  return (
    <div className="max-w-7xl mx-auto mt-16 px-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center 
    bg-clip-text text-transparent 
    bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400
    drop-shadow-lg
    animate-pulse
    mb-8">
  Delicious Treats Just For You!
</h2>


      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-10">
        {["food", "drink"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
              category === cat
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:scale-105"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="relative group bg-neutral-900 rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 "
          >
            <img
              src={item.image || "https://via.placeholder.com/300"}
              alt={item.name}
              className="w-full h-56 object-cover group-hover:brightness-90 transition-all duration-300"
            />

            <div className="p-4 bg-neutral-900/80 backdrop-blur-md">
              <h3 className="text-lg font-bold text-neutral-200 mb-1">{item.name}</h3>
              <p className="text-pink-500 font-semibold">Tk {item.price}</p>
            </div>

            {/* Order Now button */}
         <div>
             <button
              onClick={() => navigate(`/order-now/${item._id}`)}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full shadow-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-sm"
            >
              Order Now
            </button>
         </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
