import { createContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Create User (Sign Up)
  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // 🔹 Sign In
  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🔹 Log Out
  const logOut = async () => {
    localStorage.removeItem("access-token");
    setUser(null);
    return signOut(auth);
  };

  // 🔹 Track Auth State, Fetch JWT and Role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser?.email) {
        try {
          // 1️⃣ Request JWT from backend
          const tokenRes = await fetch(`${import.meta.env.VITE_NEXT_API_URL}/jwt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUser.email }),
          });

          if (!tokenRes.ok) throw new Error("Failed to fetch JWT");
          const tokenData = await tokenRes.json();
          localStorage.setItem("access-token", tokenData.token);

          // 2️⃣ Fetch user role from backend
          const roleRes = await fetch(
            `${import.meta.env.VITE_NEXT_API_URL}/users/${encodeURIComponent(
              currentUser.email
            )}`,
            {
              headers: {
                authorization: `Bearer ${tokenData.token}`,
              },
            }
          );

          if (!roleRes.ok) {
            console.warn(
              `Failed to fetch role for ${currentUser.email}, defaulting to 'user'`
            );
            setUser({ ...currentUser, role: "user" });
          } else {
            const roleData = await roleRes.json();
            setUser({ ...currentUser, role: roleData.role || "user" });
          }
        } catch (error) {
          console.error("AuthProviders Error:", error);
          // fallback to normal Firebase user if JWT/role fails
          setUser({ ...currentUser, role: "user" });
        } finally {
          setLoading(false);
        }
      } else {
        // User logged out
        localStorage.removeItem("access-token");
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
