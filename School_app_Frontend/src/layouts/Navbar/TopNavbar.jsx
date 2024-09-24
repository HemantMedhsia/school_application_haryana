import React from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { IoCalendarOutline, IoLocationSharp } from "react-icons/io5";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
const navigation = [
  { name: "Happy Model English School", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TopNavbar =  ({ isCollapsed }) => {
  const {  logout, name, userRole } =  useAuth();

  return (
    <Disclosure
      as="nav"
      className={`fixed top-0 ${
        isCollapsed ? "left-20" : "left-64"
      } mx-6 my-2 mt-4 rounded-md right-0 h-14 bg-[#283046] transition-all duration-300 shadow-md z-50`}
    >
      {({ open }) => (
        <>
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex h-16 items-center w-full justify-between">
              <div className="flex gap-2">
                <div className="flex items-center">
                  <img
                    className="h-8 w-auto sm:mr-4 md:mr-4"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>

                <div className="hidden sm:flex">
                  <div className="flex ">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-xl font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Icon buttons */}
                <div className="hidden sm:flex">
                  <div className="flex px-3 py-2 hover:bg-gray-700 rounded-md font-bold cursor-pointer text-[#65FA9E] text-2xl items-center">
                    <Link to="/school/calendar">
                      <IoCalendarOutline />
                    </Link>
                  </div>
                  <div className="flex px-3 py-2 hover:bg-gray-700 rounded-md font-bold cursor-pointer text-[#65FA9E] text-2xl items-center">
                    <MdOutlineMarkEmailUnread />
                  </div>
                  <div className="flex px-3 py-2 hover:bg-gray-700 rounded-md font-bold cursor-pointer text-[#65FA9E] text-2xl items-center">
                    <BiSupport />
                  </div>
                  <div className="flex px-3 py-2 hover:bg-gray-700 rounded-md font-bold cursor-pointer text-[#65FA9E] text-2xl items-center">
                    <IoLocationSharp />
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>

            {/* User Section */}
            <div className="absolute w-full inset-y-0 right-0 flex justify-end items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="flex flex-col justify-end items-center mx-1">
                <div className="w-full text-sm text-gray-400">
                  {name && name.name ? name.name : "You login as Guest"}
                </div>
                <div className="text-right w-full text-xs font-semibold text-[#65FA9E]">
                  {userRole ? userRole : "Guest"}
                </div>
              </div>

              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex rounded-full bg-[#283046] text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                  />
                </Menu.Button>
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Your Profile
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => alert("Settings clicked")}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={logout}
                        href="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Sign out
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>

            {/* Mobile Icon buttons */}
            <div className="flex justify-evenly">
              <Link
                to="/school/calendar"
                className="flex px-3 py-2 hover:bg-gray-700 rounded-md font-bold cursor-pointer text-[#65FA9E] text-2xl items-center"
              >
                <IoCalendarOutline />
              </Link>
              <MdOutlineMarkEmailUnread className="px-3 py-2 hover:bg-gray-700 rounded-md font-bold cursor-pointer text-[#65FA9E] text-2xl items-center" />
              <BiSupport className="px-3 py-2 hover:bg-gray-700 rounded-md font-bold cursor-pointer text-[#65FA9E] text-2xl items-center" />
              <IoLocationSharp className="px-3 py-2 hover:bg-gray-700 rounded-md font-bold cursor-pointer text-[#65FA9E] text-2xl items-center" />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default TopNavbar;
