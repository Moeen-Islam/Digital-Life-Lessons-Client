import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import PublicLessons from "./pages/PublicLessons";
import LessonDetails from "./pages/LessonDetails";
import { Login, Register } from "./pages/AuthPages";
import Pricing from "./pages/Pricing";
import { PaymentCancel, PaymentSuccess } from "./pages/PaymentPages";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import AddLesson from "./pages/dashboard/AddLesson";
import MyLessons from "./pages/dashboard/MyLessons";
import UpdateLesson from "./pages/dashboard/UpdateLesson";
import MyFavorites from "./pages/dashboard/MyFavorites";
import Profile from "./pages/dashboard/Profile";
import AdminHome from "./pages/admin/AdminHome";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageLessons from "./pages/admin/ManageLessons";
import ReportedLessons from "./pages/admin/ReportedLessons";
import AdminProfile from "./pages/admin/AdminProfile";
import AuthorProfile from "./pages/AuthorProfile";
import StaticPage from "./pages/StaticPage";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("theme", theme); }, [theme]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout theme={theme} setTheme={setTheme} />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "public-lessons", element: <PublicLessons /> },
        { path: "lessons/:id", element: <ProtectedRoute><LessonDetails /></ProtectedRoute> },
        { path: "profile/:authId", element: <AuthorProfile /> },
        { path: "pricing", element: <ProtectedRoute><Pricing /></ProtectedRoute> },
        { path: "payment/success", element: <ProtectedRoute><PaymentSuccess /></ProtectedRoute> },
        { path: "payment/cancel", element: <ProtectedRoute><PaymentCancel /></ProtectedRoute> },
        { path: "terms", element: <StaticPage title="Terms & Conditions" /> },
        { path: "privacy", element: <StaticPage title="Privacy Policy" /> },
        {
          path: "dashboard",
          element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
          children: [
            { index: true, element: <DashboardHome /> },
            { path: "add-lesson", element: <AddLesson /> },
            { path: "my-lessons", element: <MyLessons /> },
            { path: "update-lesson/:id", element: <UpdateLesson /> },
            { path: "my-favorites", element: <MyFavorites /> },
            { path: "profile", element: <Profile /> },
            { path: "admin", element: <AdminRoute><AdminHome /></AdminRoute> },
            { path: "admin/manage-users", element: <AdminRoute><ManageUsers /></AdminRoute> },
            { path: "admin/manage-lessons", element: <AdminRoute><ManageLessons /></AdminRoute> },
            { path: "admin/reported-lessons", element: <AdminRoute><ReportedLessons /></AdminRoute> },
            { path: "admin/profile", element: <AdminRoute><AdminProfile /></AdminRoute> }
          ]
        },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" replace /> }
      ]
    }
  ]);
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </AuthProvider>
  </React.StrictMode>
);
