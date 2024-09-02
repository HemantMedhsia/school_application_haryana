import React from "react";
import TopNavbar from "../components/Navbar/TopNavbar";
import LeftNavbar from "../components/Navbar/LeftNavbar";
import Footer from "../components/Footer/Footer";
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
