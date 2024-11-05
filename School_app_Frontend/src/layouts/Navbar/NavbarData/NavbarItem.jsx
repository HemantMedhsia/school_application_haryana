import React from 'react';
import { Link } from 'react-router-dom';

const NavbarItem = ({ item, isActive, onClick, isCollapsed }) => {
  return (
    <Link
      to={item.to}
      className={`${
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } group flex px-3 py-2 text-md items-center font-medium rounded-md`}
      onClick={onClick}
    >
     {
      isCollapsed ? <item.icon className=" flex justify-center text-[#7367f0] items-center h-6 w-6" aria-hidden="true" /> : <div className='flex'><item.icon className="text-[#7367f0] h-6 w-6" aria-hidden="true" />
      <span className='ml-3 flex items-center'>{item.name}</span></div>
     }
      
    </Link>
  );
};

export default NavbarItem;
