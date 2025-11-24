import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";

export default function ManageFoods() {
  const { user } = useContext(AuthContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access-token");
        const res = await fetch(`${import.meta.env.VITE_NEXT_API_URL}/foods`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setFoods(data);
      } catch (err) {
        console.error(err);
        alert("❌ Error fetching foods. Check console.");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
    if (!user || user.role !== "admin") return alert("🚫 Only admin can delete foods!");
    if (!window.confirm("Are you sure you want to delete this food?")) return;

    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${import.meta.env.VITE_NEXT_API_URL}/foods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.deletedCount > 0) {
        setFoods((prev) => prev.filter((f) => f._id !== id));
        alert("✅ Food deleted successfully!");
      } else alert("❌ Failed to delete food");
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting food.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-neutral-300">
        Loading foods...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-neutral-900/90 backdrop-blur-md rounded-3xl">
      <h2 className="text-3xl font-bold text-red-500 mb-6">Manage Foods</h2>

      {foods.length === 0 ? (
        <p className="text-neutral-300">No foods found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-neutral-700">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead className="bg-neutral-800 text-neutral-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-neutral-900 divide-y divide-neutral-700">
              {foods.map((food) => (
                <tr key={food._id} className="hover:bg-neutral-800/50 transition-all">
                  <td className="px-4 py-3">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-14 h-14 object-cover rounded-lg border border-neutral-700"
                    />
                  </td>
                  <td className="px-4 py-3">{food.name}</td>
                  <td className="px-4 py-3">{food.category}</td>
                  <td className="px-4 py-3">${food.price}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-xl text-white text-sm shadow-md hover:scale-105 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
