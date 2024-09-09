import {
  FaBell,
  FaBook,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaHome,
  FaPen,
  FaProjectDiagram,
  FaUser,
  FaUserFriends,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

export const navigation = [
  {
    name: "Dashboard",
    to: "/school/testing",
    icon: FaHome,
    current: true,
    roles: ["Admin", "Teacher", "Student"],
  },
  {
    name: "My Profile",
    to: "/school/profile",
    icon: FaUserFriends,
    current: false,
    roles: ["Student", "Teacher"],
  },
  {
    name: "Student",
    to: "#",
    icon: FaUsers,
    current: false,
    roles: ["Admin", "Teacher","Student"],
    children: [
      {
        name: "Student Information",
        to: "/school/student-information",
        icon: FaUser,
        roles: ["Admin", "Teacher","Student"],
      },
      {
        name: "Student Admission",
        to: "/school/student-admission",
        icon: FaUser,
        roles: ["Admin", "Teacher","Student"],
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
    name: "Parent",
    to: "#",
    icon: FaUserFriends,
    current: false,
    roles: ["Admin", "Teacher"],
    children: [
      {
        name: "Parent Information",
        to: "/school/parent-information",
        icon: FaUser,
        roles: ["Admin", "Teacher"],
      },
    ],
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
    children: [
      {
        name: "Create Notice",
        to: "/school/create-notice",
        icon: FaUser,
        roles: ["Student", "Teacher", "Admin"],
      },
      {
        name: "View All Notices",
        to: "/view-all-notices",
        icon: FaBook,
        roles: ["Student", "Teacher", "Admin"],
      },
    ]
  },
];
