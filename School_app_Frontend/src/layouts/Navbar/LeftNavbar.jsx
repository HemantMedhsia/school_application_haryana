import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import aradhyaTechLogo from "../../assets/pngegg.png";
import NavbarDropdown from "./NavbarData/NavbarDropdown.jsx";
import NavbarItem from "./NavbarData/NavbarItem.jsx";
import { navigation } from "./NavbarData/NavigationData.js";

const LeftNavbar = ({ role }) => {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const location = useLocation();

  const handleDropdownClick = (name) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  // Filter navigation based on the user's role
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-[#283046]">
      <div className="flex flex-col h-full bg-[#283046] text-white">
        <div className="flex items-center justify-center h-16 bg-[#283046]">
          <img src={aradhyaTechLogo} alt="Logo" className="h-16 w-auto mt-2" />
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-2 overflow-y-auto">
          {filteredNavigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <NavbarDropdown
                  item={item}
                  isOpen={dropdownOpen[item.name]}
                  role={role}
                  onClick={() => handleDropdownClick(item.name)}
                />
              ) : (
                <NavbarItem
                  item={item}
                  isActive={location.pathname === item.to}
                  onClick={null}
                />
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LeftNavbar;
