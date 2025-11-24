import { useContext } from "react";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProviders";

const Add = () => {
  const food = useLoaderData();
  const { name: foodName, price: foodPrice, imageUrl } = food;
  const { user } = useContext(AuthContext);

  const handleConfirm = () => {
    const order = {
      foodName,
      price: foodPrice,
      orderedBy: user?.email || "Anonymous",
    };

    fetch(`${import.meta.env.VITE_NEXT_API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Order Confirmed:", data);
        alert("Your order has been confirmed!");
      })
      .catch((error) => {
        console.error("Error confirming order:", error);
        alert("Failed to confirm order. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900/90 px-4">
      <div className="max-w-md w-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 text-center transition-all">
        <h2 className="text-3xl font-extrabold mb-4 text-red-500">
          Confirm Your Order
        </h2>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={foodName}
            className="w-48 h-48 object-cover mx-auto rounded-2xl mb-4 shadow-lg hover:scale-105 transition-transform duration-500"
          />
        )}

        <h3 className="text-2xl font-semibold mb-2 text-neutral-200">{foodName}</h3>
        <p className="text-xl font-bold mb-6 text-pink-500">
          Price: Tk {foodPrice.toFixed(2)}
        </p>

        <button
          onClick={handleConfirm}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition transform hover:scale-105"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Add;
