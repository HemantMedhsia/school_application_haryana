import React from "react";
import TopNavbar from "./Navbar/TopNavbar";
import LeftNavbar from "./Navbar/LeftNavbar";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col h-screen bg-[#161e31]">
      <div className="flex flex-1">
        <LeftNavbar />
        <div className="flex-1 flex m-4 flex-col">
          <TopNavbar className="ml-4" />
          <main className="flex-1 mt-2 rounded-md">
            <Outlet />
          </main>
        </div>
        
      </div>
      
    </div>
  );
}

export default Layout;
