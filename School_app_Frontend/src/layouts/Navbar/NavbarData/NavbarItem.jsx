import React from 'react';
import { Link } from 'react-router-dom';

const NavbarItem = ({ item, isActive, onClick }) => {
  return (
    <Link
      to={item.to}
      className={`${
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
      onClick={onClick}
    >
      <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
      {item.name}
    </Link>
  );
};

export default NavbarItem;
