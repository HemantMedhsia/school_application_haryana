import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
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
  { name: "Dashboard", to: "/", icon: FaHome, current: true },
  {
    name: "Student",
    to: "#",
    icon: FaUsers,
    current: false,
    children: [
      {
        name: "Student Information",
        to: "/school/student-information",
        icon: FaUser,
      },
      { name: "Student Admission", to: "/school/student-admission", icon: FaUser },
      { name: "Grades", to: "/grades", icon: FaBook },
      { name: "Attendance", to: "/attendance", icon: FaCheckCircle },
    ],
  },
  {
    name: "Teacher",
    to: "#",
    icon: FaProjectDiagram,
    current: false,
    children: [
      { name: "Profile", to: "/teacher-profile", icon: FaUser },
      { name: "Grades", to: "/teacher-grades", icon: FaBook },
      { name: "Attendance", to: "/teacher-attendance", icon: FaCheckCircle },
    ],
  },
  { name: "Parents", to: "/parents", icon: FaUserFriends, current: false },
  { name: "Staff", to: "/staff", icon: FaUserTie, current: false },
  { name: "Time Table", to: "/time-table", icon: FaClock, current: false },
  { name: "Exams", to: "/exams", icon: FaPen, current: false },
  { name: "Marks", to: "/marks", icon: FaChartLine, current: false },
  { name: "Notice", to: "/notice", icon: FaBell, current: false },
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
    <div className="fixed top-0 left-0 w-64 h-screen bg-[#283046]"> {/* h-[calc(100vh-4rem)] for full height minus TopNavbar height */}
      <div className="flex flex-col h-full bg-[#283046] text-white">
        <div className="flex items-center justify-center h-16 bg-[#283046]">
          <img src={aradhyaTechLogo} alt="Logo" className="h-16 w-auto mt-2" />
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                to={item.to}
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
              </Link>
              {item.children && dropdownOpen[item.name] && (
                <div className="ml-6 mt-2 space-y-1 transition-all duration-300 ease-in-out">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.to}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    >
                      <child.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                      {child.name}
                    </Link>
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
