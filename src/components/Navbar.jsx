import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Moon, Sun, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { signOut } from "../lib/auth-client";
import { useAuth } from "../context/AuthContext";

function BrandLogo() {
  return (
    <Link to="/" className="logo" aria-label="Digital Life Lessons home">
      <span className="logoMark">Ω</span>
      <span className="logoText">
        Digital Life Lessons
        <small>Wisdom Ledger</small>
      </span>
    </Link>
  );
}

function Avatar({ user, authUser }) {
  const [imageError, setImageError] = useState(false);

  const name = user?.name || authUser?.name || "User";
  const image =
    user?.photoURL ||
    user?.image ||
    authUser?.image ||
    authUser?.photoURL ||
    "";

  const fallback = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;

  return (
    <img
      src={!imageError && image ? image : fallback}
      alt={name}
      onError={() => setImageError(true)}
    />
  );
}

export default function Navbar({ theme, setTheme }) {
  const { isLoggedIn, user, authUser, isPremium } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const displayName = useMemo(() => {
    return user?.name || authUser?.name || "User";
  }, [user, authUser]);

  const displayEmail = useMemo(() => {
    return user?.email || authUser?.email || "";
  }, [user, authUser]);

  async function handleLogout() {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  const links = (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/public-lessons">Public Lessons</NavLink>
      {isLoggedIn && <NavLink to="/dashboard/add-lesson">Add Lesson</NavLink>}
      {isLoggedIn && <NavLink to="/dashboard/my-lessons">My Lessons</NavLink>}
      {isLoggedIn && !isPremium && <NavLink to="/pricing">Pricing / Upgrade</NavLink>}
      {isPremium && <span className="premiumBadge">Premium ⭐</span>}
    </>
  );

  return (
    <header className="navbar">
      <BrandLogo />

      <nav className="desktopNav">{links}</nav>

      <div className="navActions">
        <button
          className="iconBtn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>

        {!isLoggedIn ? (
          <div className="authLinks">
            <Link to="/login">Login</Link>
            <Link className="btn primary small" to="/register">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="dropdown">
            <button className="avatarBtn" type="button" aria-label="Open profile menu">
              <Avatar user={user} authUser={authUser} />
            </button>

            <div className="dropdownMenu">
              <strong>{displayName}</strong>
              <small>{displayEmail}</small>

              <Link to="/dashboard/profile">
                <UserRound size={16} /> Profile
              </Link>

              <Link to="/dashboard">
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <button type="button" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}

        <button
          className="iconBtn mobileOnly"
          onClick={() => setOpen(!open)}
          aria-label="Open mobile menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="mobileNav" onClick={() => setOpen(false)}>
          {links}
          {!isLoggedIn && (
            <>
              <Link to="/login">Login</Link>
              <Link className="btn primary small" to="/register">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}