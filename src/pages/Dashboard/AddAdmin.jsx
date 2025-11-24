import { useState } from "react";

function AddAdminForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin"); // default "admin"

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_NEXT_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, role }),
      });

      if (!res.ok) throw new Error("Failed to add admin");

      alert(`${name} is now added as ${role} ✅`);
      setName("");
      setEmail("");
      setRole("admin");
    } catch (err) {
      console.error(err);
      alert("Failed to add admin ❌");
    }
  };

  return (
    <div className="p-8 bg-neutral-900/90 backdrop-blur-md rounded-3xl max-w-md mx-auto mt-12 shadow-2xl border border-neutral-700">
      <h2 className="text-3xl font-extrabold mb-6 text-red-500 text-center">
        Add Admin
      </h2>
      <form onSubmit={handleAddAdmin} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded-xl bg-neutral-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-xl bg-neutral-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-3 rounded-xl bg-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        >
          <option value="admin">Admin</option>
          <option value="super admin">Super Admin</option>
        </select>
        <button
          type="submit"
          className="p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition transform"
        >
          Add Admin
        </button>
      </form>
    </div>
  );
}

export default AddAdminForm;
