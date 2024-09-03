// layouts/Layout.jsx
import React from "react";
import TopNavbar from "./Navbar/TopNavbar";
import LeftNavbar from "./Navbar/LeftNavbar";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <TopNavbar />
      <div className="flex-1 flex flex-col">
        <LeftNavbar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
