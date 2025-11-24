import { useEffect, useState } from "react";
import FoodCard from "./Foodcard";
import { Link } from "react-router-dom";

const AllFoods = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_NEXT_API_URL}/foods`)
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error("Error fetching foods:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mt-16 mb-10">
        <h1
          className="text-4xl md:text-5xl font-extrabold 
      bg-clip-text text-transparent 
      bg-linear-to-r from-red-500 via-pink-500 to-yellow-400
      drop-shadow-lg
      animate-pulse"
        >
          All Foods
        </h1>
        <p className="mt-2 text-neutral-300 text-lg md:text-xl">
          Discover our delicious menu and order your favorites easily!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((food) => (
          <div key={food._id} className="">
            <FoodCard food={food} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFoods;
