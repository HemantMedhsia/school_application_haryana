import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#283046] text-white text-center p-4">
      © {new Date().getFullYear()} Your Company. All rights reserved.
    </footer>
  );
};

export default Footer;