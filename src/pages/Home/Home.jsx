import { useEffect, useState } from "react";
import Banner from "./Banner/Banner";
import FoodCard from "./AllFoods/Foodcard";
import { Link } from "react-router-dom";
import About from "../About/About";

const Home = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_NEXT_API_URL}/foods`)
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error("Error fetching foods:", err));
  }, []);

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

          {/* Subtitle */}
          <p className="mt-2 text-neutral-300 text-lg md:text-xl">
            Our Most Popular Dishes
          </p>

          {/* Optional Divider */}
          <div className="mt-4 w-24 h-1 mx-auto bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {foods.slice(0, 4).map((food) => (
            <FoodCard key={food._id} food={food} />
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

      <About></About>
    </div>
  );
};

export default Home;
