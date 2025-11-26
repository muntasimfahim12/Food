import { useEffect, useState } from "react";
import FoodCard from "./Foodcard";

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [filteredFoods, setFilteredFoods] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_NEXT_API_URL}/foods`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setFilteredFoods(data);
      })
      .catch((err) => console.error("Error fetching foods:", err));
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = foods;

    if (search.trim() !== "") {
      result = result.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter(
        (food) => food.category?.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredFoods(result);
  }, [search, category, foods]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mt-16 mb-10">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400
            drop-shadow-lg animate-pulse"
        >
          All Foods
        </h1>

        <p className="mt-2 text-neutral-300 text-base sm:text-lg md:text-xl">
          Discover our delicious menu and order your favorites easily!
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search foods..."
            className="w-full max-w-xs sm:max-w-md px-5 py-3 
              rounded-lg bg-white/20 backdrop-blur-md 
              border border-white/30 text-white 
              placeholder-gray-200 focus:outline-none 
              focus:ring-2 focus:ring-orange-400 
              transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 px-2">
          {["all", "food", "drink", "snacks", "dessert"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full font-semibold border 
                transition-all duration-300 text-sm sm:text-base ${
                  category === cat
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white/10 text-white border-white/20 hover:bg-orange-500 hover:text-white"
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 pb-20">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food, index) => (
            <div
              key={food._id}
              className="transform transition duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ animation: `fadeIn 0.4s ease ${index * 0.1}s` }}
            >
              <FoodCard food={food} />
            </div>
          ))
        ) : (
          <p className="text-center text-white col-span-full text-xl">
            No foods found 😔
          </p>
        )}
      </div>
    </div>
  );
};

export default AllFoods;
