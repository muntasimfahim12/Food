"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProviders";

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logOut()
      .then(() => {
        localStorage.removeItem("access-token");
        navigate("/login");
      })
      .catch((err) => console.error(err));
  };

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "All Foods", link: "/all-foods" },
    { name: "Gallery", link: "/gallery" },
    { name: "My Profile", link: "/my-profile" },
  ];

  return (
    <>
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 bg-neutral-900/80 backdrop-blur-md shadow-lg border-b border-neutral-700 transition-colors duration-300">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg"
          >
            FlavorNest
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {menuItems.map(({ name, link }) => (
              <NavLink
                key={name}
                to={link}
                end={link === "/"}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:backdrop-blur-md hover:bg-neutral-800/40 ${
                    isActive
                      ? "text-pink-400 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-pink-400 after:rounded-full"
                      : "text-neutral-200 hover:text-pink-400"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}

            {/* Admin Dashboard */}
            {(user?.role === "admin" || user?.role === "super admin") && (
              <NavLink
                to="/dashboard/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:backdrop-blur-md hover:bg-neutral-800/40 ${
                    isActive
                      ? "text-pink-400 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-pink-400 after:rounded-full"
                      : "text-neutral-200 hover:text-pink-400"
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* User Profile */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-neutral-800/60 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  aria-label="User menu"
                >
                  <img
                    src={
                      user.photoURL
                        ? user.photoURL // যদি ইউজারের profile picture থাকে
                        : `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(
                            user.displayName || "User"
                          )}` // না থাকলে initials generate হবে
                    }
                    alt={user.displayName || "User"}
                    className="w-10 h-10 rounded-full border border-neutral-700 shadow-sm"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-neutral-900/95 border border-neutral-700 rounded-xl shadow-xl py-2 z-50 backdrop-blur-md transition-all duration-300 opacity-100 transform scale-100">
                    <Link
                      to="/my-profile"
                      className="block px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800 transition-all duration-300"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-pink-500 hover:bg-pink-500/10 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 border border-pink-500 text-pink-500 rounded-lg text-sm hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-2xl text-neutral-200 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? "✖" : "☰"}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-neutral-900 border-t border-neutral-700 p-4 space-y-3 transition-all duration-500 overflow-hidden ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {menuItems.map(({ name, link }) => (
            <NavLink
              key={name}
              to={link}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-neutral-200 hover:bg-pink-500/10 hover:text-pink-400 transition-all duration-300 transform hover:scale-105"
            >
              {name}
            </NavLink>
          ))}

          {(user?.role === "admin" || user?.role === "super admin") && (
            <NavLink
              to="/dashboard/admin"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-neutral-200 hover:bg-pink-500/10 hover:text-pink-400 transition-all duration-300 transform hover:scale-105"
            >
              Dashboard
            </NavLink>
          )}

          {!user && (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 bg-pink-500 text-white rounded-lg text-center hover:bg-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 border border-pink-500 text-pink-500 rounded-lg text-center hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to avoid content overlap */}
      <div className="h-20 md:h-20"></div>
    </>
  );
}
