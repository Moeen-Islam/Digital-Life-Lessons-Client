import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ theme, setTheme }) {
  const location = useLocation();
  const isNotFound = location.pathname === "/404";
  return (
    <>
      {!isNotFound && <Navbar theme={theme} setTheme={setTheme} />}
      <main className="pageShell"><Outlet /></main>
      {!isNotFound && <Footer />}
    </>
  );
}
