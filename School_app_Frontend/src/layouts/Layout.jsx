import React from "react";
import TopNavbar from "./Navbar/TopNavbar";
import LeftNavbar from "./Navbar/LeftNavbar";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-row h-screen bg-[#161e31]">
      <TopNavbar />
      <div className="flex flex-1 mt-16"> {/* mt-16 for TopNavbar height */}
        <LeftNavbar />
        <div className="flex-1 ml-64 overflow-y-auto"> {/* ml-64 for LeftNavbar width */}
          <main className=" m-4 w-[1230px] mt-5 rounded-md">
            <Outlet />
          </main>
          {/* <Footer /> Include Footer if needed */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
