import React from "react";
import TopNavbar from "./Navbar/TopNavbar";
import LeftNavbar from "./Navbar/LeftNavbar";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return <>
    <TopNavbar/>
    <LeftNavbar/>
    <Outlet/>
    <Footer/>
     </>;
};

export default Layout;
