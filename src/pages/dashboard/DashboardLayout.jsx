import { NavLink, Outlet } from "react-router-dom";
import { BookPlus, BookOpen, Heart, LayoutDashboard, Shield, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const { isAdmin } = useAuth();
  return (
    <section className="dashboardShell">
      <aside className="dashSidebar">
        <h3>Dashboard</h3>
        <NavLink to="/dashboard" end><LayoutDashboard /> Overview</NavLink>
        <NavLink to="/dashboard/add-lesson"><BookPlus /> Add Lesson</NavLink>
        <NavLink to="/dashboard/my-lessons"><BookOpen /> My Lessons</NavLink>
        <NavLink to="/dashboard/my-favorites"><Heart /> My Favorites</NavLink>
        <NavLink to="/dashboard/profile"><UserRound /> Profile</NavLink>
        {isAdmin && <><h3>Admin</h3><NavLink to="/dashboard/admin"><Shield /> Admin Home</NavLink><NavLink to="/dashboard/admin/manage-users">Manage Users</NavLink><NavLink to="/dashboard/admin/manage-lessons">Manage Lessons</NavLink><NavLink to="/dashboard/admin/reported-lessons">Reported Lessons</NavLink><NavLink to="/dashboard/admin/profile">Admin Profile</NavLink></>}
      </aside>
      <div className="dashContent"><Outlet /></div>
    </section>
  );
}
