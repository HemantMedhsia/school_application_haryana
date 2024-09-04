import React, { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaProjectDiagram,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaBook,
  FaCheckCircle,
  FaUserFriends,
  FaUserTie,
  FaClock,
  FaPen,
  FaChartLine,
  FaBell,
} from "react-icons/fa";
import aradhyaTechLogo from "../../assets/pngegg.png";

const navigation = [
  { name: "Dashboard", href: "#", icon: FaHome, current: true },
  {
    name: "Student",
    href: "#",
    icon: FaUsers,
    current: false,
    children: [
      { name: "Student Information", href: "#profile", icon: FaUser },
      { name: "Grades", href: "#grades", icon: FaBook },
      { name: "Attendance", href: "#attendance", icon: FaCheckCircle },
    ],
  },
  {
    name: "Teacher",
    href: "#",
    icon: FaProjectDiagram,
    current: false,
    children: [
      { name: "Profile", href: "#profile", icon: FaUser },
      { name: "Grades", href: "#grades", icon: FaBook },
      { name: "Attendance", href: "#attendance", icon: FaCheckCircle },
    ],
  },
  { name: "Parents", href: "#", icon: FaUserFriends, current: false },
  { name: "Staff", href: "#", icon: FaUserTie, current: false },
  { name: "Time Table", href: "#", icon: FaClock, current: false },
  { name: "Exams", href: "#", icon: FaPen, current: false },
  { name: "Marks", href: "#", icon: FaChartLine, current: false },
  { name: "Notice", href: "#", icon: FaBell, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LeftNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState({});

  const handleDropdownClick = (name) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  return (
    <div className="w-1/6 min-h-screen h-full bg-[#283046]">
      <div className="flex flex-col h-screen bg-[#283046] text-white">
        <div className="flex items-center justify-center h-16 bg-[#283046]">
          <img src={aradhyaTechLogo} alt="Logo" className="h-16 w-auto mt-2" />
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              <a
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
                onClick={
                  item.children ? () => handleDropdownClick(item.name) : null
                }
              >
                <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                {item.name}
                {item.children && (
                  <span className="ml-auto">
                    {dropdownOpen[item.name] ? (
                      <FaChevronUp className="h-4 w-4" />
                    ) : (
                      <FaChevronDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </a>
              {item.children && dropdownOpen[item.name] && (
                <div className="ml-6 mt-2 space-y-1 transition-all duration-300 ease-in-out">
                  {item.children.map((child) => (
                    <a
                      key={child.name}
                      href={child.href}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    >
                      <child.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                      {child.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LeftNavbar;
