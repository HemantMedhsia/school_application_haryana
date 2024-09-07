import React from "react";
import TopNavbar from "./Navbar/TopNavbar";
import LeftNavbar from "./Navbar/LeftNavbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import PyramidLoader from "../common/Loader/PyramidLoader";

function Layout() {
  const { userRole, loading } = useAuth();
  if (loading) {
    return <div><PyramidLoader/></div>;
  }
  return (
    <div className="flex h-screen bg-gray-900">
      <LeftNavbar role={userRole} />
      <div className="flex-1 flex flex-col ml-64">
        {" "}
        {/* Added margin-left to offset content */}
        <TopNavbar />
        <div className="flex-1 overflow-y-auto p-6 mt-16">
          {" "}
          {/* Adjust for top navbar height */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
