import { useEffect, useState } from "react";
import Banner from "./Banner/Banner";
import FoodCard from "./AllFoods/Foodcard";
import { Link } from "react-router-dom";
import About from "../About/About";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
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

  // 🔍 Search Filter
  useEffect(() => {
    const result = foods.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFoods(result);
  }, [search, foods]);

  return (
    <div>
      <Banner />

      {/* Top Foods Section */}
      <section className="max-w-7xl mx-auto mt-20 mb-20">
        <div className="text-center mt-16 mb-10">

          {/* Main Title */}
          <h2
            className="text-4xl md:text-5xl font-extrabold 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400
              drop-shadow-lg
              animate-pulse"
          >
            Top Foods
          </h2>

          <p className="mt-2 text-neutral-300 text-lg md:text-xl">
            Our Most Popular Dishes
          </p>

          <div className="mt-4 w-24 h-1 mx-auto bg-linear-to-r from-red-500 via-pink-500 to-yellow-400 rounded-full"></div>

          {/* 🔍 Search Box */}
          <div className="mt-8 flex justify-center">
            <input
              type="text"
              placeholder="Search foods..."
              className="w-72 md:w-96 px-5 py-3 rounded-lg bg-white/20 backdrop-blur-md 
                border border-white/30 text-white placeholder-gray-200 
                focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Animated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.slice(0, 4).map((food, index) => (
            <div
              key={food._id}
              className="transform transition duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ animation: `fadeIn 0.5s ease ${index * 0.2}s` }}
            >
              <FoodCard food={food} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/all-foods">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold">
              See All Foods
            </button>
          </Link>
        </div>
      </section>

      <About />
    </div>
  );
};

export default Home;
