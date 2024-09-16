import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import NavbarItem from "./NavbarItem";

const NavbarDropdown = ({ item, isOpen, role, onClick, isCollapsed }) => {
  return (
    <div>
      <button
        className={`${
          isOpen
            ? "bg-gray-900 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
        onClick={onClick}
      >
        <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
        {!isCollapsed && <span>{item.name}</span>} {/* Conditionally render text */}
        <span className="ml-auto">
          {isOpen ? (
            <FaChevronUp className="h-4 w-4" />
          ) : (
            <FaChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="ml-6 mt-2 space-y-1 transition-all duration-300 ease-in-out">
          {item.children
            .filter((child) => child.roles.includes(role))
            .map((child) => (
              <NavbarItem
                key={child.name}
                item={child}
                isActive={false}
                isCollapsed={isCollapsed} // Pass collapse state to child
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default NavbarDropdown;
