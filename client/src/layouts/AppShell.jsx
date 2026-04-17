import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundFX from "../components/BackgroundFX";

function AppShell() {
  return (
    <div className="app-shell">
      <BackgroundFX />
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppShell;
