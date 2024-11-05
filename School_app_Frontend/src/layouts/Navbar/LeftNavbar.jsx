import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import aradhyaTechLogo from "../../assets/pngegg.png";
import NavbarDropdown from "./NavbarData/NavbarDropdown.jsx";
import NavbarItem from "./NavbarData/NavbarItem.jsx";
import { navigation } from "./NavbarData/NavigationData.js";

const LeftNavbar = ({ role, onToggle }) => {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleDropdownClick = (name) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(role)
  );

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onToggle();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#283046] transition-width duration-300   ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full text-white">
        <div className="flex items-center justify-between h-16 w-auto p-2 bg-[#283046]">
          <img
            src={aradhyaTechLogo}
            alt="Logo"
            className={`h-12 w-52 mt-2 transition-all duration-300 ${
              isCollapsed ? "hidden" : "block"
            }`}
          />
          <button
            onClick={handleToggleCollapse}
            className="text-white focus:outline-none"
          >
            {isCollapsed ? "➔" : "←"}
          </button>
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
                  isCollapsed={isCollapsed}
                />
              ) : (
                <NavbarItem
                  item={item}
                  isActive={location.pathname === item.to}
                  onClick={null}
                  isCollapsed={isCollapsed}
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
