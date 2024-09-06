import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation
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
  {
    name: "Dashboard",
    to: "/school/testing",
    icon: FaHome,
    current: true,
    roles: ["Admin", "Teacher", "Student"],
  },
  {
    name: "My Profile",
    to: "/My-Profile",
    icon: FaUserFriends,
    current: false,
    roles: ["Student", "Teacher"],
  },
  {
    name: "Student",
    to: "#",
    icon: FaUsers,
    current: false,
    roles: ["Admin", "Teacher"],
    children: [
      {
        name: "Student Information",
        to: "/school/student-information",
        icon: FaUser,
        roles: ["Admin", "Teacher"],
      },
      {
        name: "Student Admission",
        to: "/school/student-admission",
        icon: FaUser,
        roles: ["Admin", "Teacher"],
      },
      {
        name: "Grades",
        to: "/grades",
        icon: FaBook,
        roles: ["Admin"],
      },
      {
        name: "Attendance",
        to: "/attendance",
        icon: FaCheckCircle,
        roles: ["Admin", "Student"],
      },
    ],
  },
  {
    name: "Attendance",
    to: "#",
    icon: FaProjectDiagram,
    current: false,
    roles: ["Teacher", "Admin"],
    children: [
      {
        name: "Student Attendance",
        to: "/teacher-profile",
        icon: FaUser,
        roles: ["Teacher", "Admin"],
      },
      {
        name: "Attendance By Date",
        to: "/Attendance-By-Date",
        icon: FaBook,
        roles: ["Admin", "Teacher"],
      },
    ],
  },
  {
    name: "Teacher",
    to: "#",
    icon: FaProjectDiagram,
    current: false,
    roles: ["Admin"],
    children: [
      {
        name: "Profile",
        to: "/teacher-profile",
        icon: FaUser,
        roles: ["Admin"],
      },
      { name: "Grades", to: "/teacher-grades", icon: FaBook, roles: ["Admin"] },
      {
        name: "Attendance",
        to: "/teacher-attendance",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
    ],
  },
  {
    name: "Parents",
    to: "/parents",
    icon: FaUserFriends,
    current: false,
    roles: ["Admin"],
  },
  {
    name: "Staff",
    to: "/staff",
    icon: FaUserTie,
    current: false,
    roles: ["Admin"],
  },
  {
    name: "Academic",
    to: "#",
    icon: FaClock,
    current: false,
    roles: ["Admin", "Teacher", "Student"],
    children: [
      {
        name: "Class TimeTable",
        to: "/class-timetable",
        icon: FaUser,
        roles: ["Student", "Teacher", "Admin"],
      },
      {
        name: "Teacher TimeTable",
        to: "/Teacher-TimeTable",
        icon: FaBook,
        roles: ["Teacher", "Admin"],
      },
      {
        name: "Create TimeTable",
        to: "/create-timetable",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
      {
        name: "Assign Teacher",
        to: "/assign-teacher",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
    ],
  },
  {
    name: "Exams",
    to: "/exams",
    icon: FaPen,
    current: false,
    roles: ["Admin"],
  },
  {
    name: "Fees",
    to: "/Fees",
    icon: FaUserFriends,
    current: false,
    roles: ["Student"],
  },
  {
    name: "Class TimeTable",
    to: "/Class-TimeTable",
    icon: FaUserFriends,
    current: false,
    roles: ["Student"],
  },
  {
    name: "Lesson Plan",
    to: "/Lesson-Plan",
    icon: FaUserFriends,
    current: false,
    roles: ["Student"],
  },
  {
    name: "Syllabus Status",
    to: "/Syllabus-Status",
    icon: FaUserFriends,
    current: false,
    roles: ["Student"],
  },
  {
    name: "Homework",
    to: "/Homework",
    icon: FaUserFriends,
    current: false,
    roles: ["Student"],
  },
  {
    name: "Attendance",
    to: "/Attendance",
    icon: FaUserFriends,
    current: false,
    roles: ["Student"],
  },
  {
    name: "Examination",
    to: "#",
    icon: FaChartLine,
    current: false,
    roles: ["Admin", "Teacher", "Student"],
    children: [
      {
        name: "Exam Result",
        to: "/Exam-Result",
        icon: FaUser,
        roles: ["Student", "Teacher", "Admin"],
      },
      {
        name: "Exam Schedule",
        to: "/Exam-Schedule",
        icon: FaBook,
        roles: ["Student", "Teacher", "Admin"],
      },
      {
        name: "Add Marks",
        to: "/Add-Marks",
        icon: FaCheckCircle,
        roles: ["Admin", "Teacher"],
      },
    ],
  },
  {
    name: "Notice",
    to: "/notice",
    icon: FaBell,
    current: false,
    roles: ["Admin", "Teacher", "Student"],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
              <Link
                to={item.to}
                className={classNames(
                  location.pathname === item.to // Check if the current path matches
                    ? "bg-gray-900 text-white" // Active link styling
                    : "text-gray-300 hover:bg-gray-700 hover:text-white", // Inactive link styling
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
                  {item.children
                    .filter((child) => child.roles.includes(role))
                    .map((child) => (
                      <Link
                        key={child.name}
                        to={child.to}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      >
                        <child.icon
                          className="mr-3 h-5 w-5"
                          aria-hidden="true"
                        />
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
