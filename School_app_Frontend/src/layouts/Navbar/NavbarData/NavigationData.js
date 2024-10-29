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
import { Navigate } from "react-router-dom";

export const navigation = [
  {
    name: "Dashboard",
    to: "/school/dashboard",
    icon: FaHome,
    current: true,
    roles: ["Admin", "Teacher", "Student", "Parent"],
  },
  // {
  //   name: "My Profile",
  //   to: "/school/profile",
  //   icon: FaUserFriends,
  //   current: false,
  //   roles: ["Student", "Teacher"],
  // },
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
        roles: ["Admin", "Teacher", "Student"],
      },
      {
        name: "Student Admission",
        to: "/school/student-admission",
        icon: FaUser,
        roles: ["Admin", "Teacher", "Student"],
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
        to: "/school/attendance",
        icon: FaUser,
        roles: ["Teacher", "Admin"],
      },
      {
        name: "Teacher Attendance",
        to: "/school/teacher-attendance",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "Staff Attendance",
        to: "/school/staff-attendance",
        icon: FaUser,
        roles: ["Admin"],
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
        name: "Teacher Information",
        to: "/school/all-teachers",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "Add Teacher",
        to: "/school/teacher-add",
        icon: FaBook,
        roles: ["Admin"],
      },
    ],
  },
  {
    name: "Parent",
    to: "#",
    icon: FaUserFriends,
    current: false,
    roles: ["Admin"],
    children: [
      {
        name: "Parent Information",
        to: "/school/parent-information",
        icon: FaUser,
        roles: ["Admin"],
      },
    ],
  },

  {
    name: "Staff",
    to: "/staff",
    icon: FaUserTie,
    current: false,
    roles: ["Admin"],
    children: [
      {
        name: "Staff Information",
        to: "/school/all-staffs",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "Add Staff",
        to: "/school/staff-add",
        icon: FaBook,
        roles: ["Admin"],
      },
    ],
  },
  {
    name: "Academic",
    to: "#",
    icon: FaClock,
    current: false,
    roles: ["Admin", "Teacher", "Parent", "Student"],
    children: [
      {
        name: "Class TimeTable",
        to: "/school/class-timetable",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "Class TimeTable",
        to: "/school/class-timetable-user",
        icon: FaUser,
        roles: ["Student", "Teacher", "Parent"],
      },

      {
        name: "Teacher Timetable",
        to: "/school/teacher-timetable",
        icon: FaBook,
        roles: ["Admin"],
      },
      {
        name: "Create TimeTable",
        to: "/school/create-timetable",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
      // {
      //   name: "Assign Teacher",
      //   to: "/school/assign-teacher",
      //   icon: FaCheckCircle,
      //   roles: ["Admin"],
      // },
      {
        name: "Create Section",
        to: "/school/create-section",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
      {
        name: "Create Class",
        to: "/school/create-class",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
      {
        name: "Add Subjects",
        to: "/school/add-subjects",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
      {
        name: "Create Subject Group",
        to: "/school/create-subject-group",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
    ],
  },

  {
    name: "Fees",
    to: "/school/student-fees",
    icon: FaUserFriends,
    current: false,
    roles: ["Student", "Parent"],
  },
  {
    name: "Class TimeTable",
    to: "/school/class-timetable",
    icon: FaUserFriends,
    current: false,
    roles: ["Student, Teacher, Admin"],
  },
  {
    name: "Lesson Plan",
    to: "/school/student-lesson-Plan",
    icon: FaUserFriends,
    current: false,
    roles: ["Student", "Parent"],
  },
  {
    name: "Syllabus Status",
    to: "/school/student-syallabus-status",
    icon: FaUserFriends,
    current: false,
    roles: ["Student", "Parent"],
  },
  {
    name: "Homework",
    to: "/school/student-homework",
    icon: FaUserFriends,
    current: false,
    roles: ["Student", "Parent"],
  },

  {
    name: "Examination",
    to: "#",
    icon: FaChartLine,
    current: false,
    roles: ["Admin", "Teacher", "Student", "Parent"],
    children: [
      {
        name: "Exam Group",
        to: "/school/exam-group",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "Exam Type",
        to: "/school/exam-type",
        icon: FaBook,
        roles: ["Admin"],
      },
      {
        name: "Add Marks",
        to: "/school/add-marks",
        icon: FaCheckCircle,
        roles: ["Admin", "Teacher"],
      },
      {
        name: "Exam Schedule",
        to: "/school/exam-schedule",
        icon: FaCheckCircle,
        roles: ["Admin"],
      },
      {
        name: "View Exam Schedule",
        to: "/school/view-exam-schedule",
        icon: FaCheckCircle,
        roles: ["Admin", "Teacher"],
      },
      {
        name: "View Exam Schedule",
        to: "/school/view-exam-schedule-student-and-parent",
        icon: FaCheckCircle,
        roles: ["Student", "Parent"],
      },
      {
        name: "View Result",
        to: "/school/view-result",
        icon: FaCheckCircle,
        roles: ["Student", "Parent"],
      },

      {
        name: "View Marks",
        to: "/school/view-marks",
        icon: FaCheckCircle,
        roles: ["Admin", "Teacher"],
      },
    ],
  },
  {
    name: "Home Work",
    to: "#",
    icon: FaChartLine,
    current: false,
    roles: ["Admin", "Teacher"],
    children: [
      {
        name: "Add Home Work",
        to: "/school/add-home-work",
        icon: FaUser,
        roles: ["Admin", "Teacher"],
      },
      {
        name: "View Home Work",
        to: "/school/view-home-work",
        icon: FaBook,
        roles: ["Admin", "Teacher"],
      },
    ],
  },

  {
    name: "Lesson Plan",
    to: "#",
    icon: FaChartLine,
    current: false,
    roles: ["Admin", "Teacher"],
    children: [
      {
        name: "Manage Lesson Plan",
        to: "/school/manage-lesson-Plan",
        icon: FaUser,
        roles: ["Admin", "Teacher"],
      },
      {
        name: "Syllabus Status",
        to: "/school/syallabus-status",
        icon: FaBook,
        roles: ["Admin", "Teacher"],
      },
    ],
  },
  {
    name: "Results",
    to: "/results",
    icon: FaBell,
    current: false,
    roles: ["Admin"],
    children: [
      {
        name: "All Students Result",
        to: "/school/students-results",
        icon: FaUser,
        roles: ["Admin"],
      },
    ],
  },
  {
    name: "Fees Management",
    to: "/fees",
    icon: FaBell,
    current: false,
    roles: ["Admin"],
    children: [
        {
        name: "Create Fees",
        to: "/school/create-fees",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "Fees Installment",
        to: "/school/fees-installment",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "Studnet Fees",
        to: "/school/student-fees-page",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "Class Fee Records",
        to: "/school/class-fees-record",
        icon: FaUser,
        roles: ["Admin"],
      },
    ],
  },
  {
    name: "Attendance",
    to: "/school/student-attendance-view",
    icon: FaBell,
    current: false,
    roles: ["Student", "Parent"],
  },
  {
    name: "Attendance",
    to: "/school/teacher-attendance-view",
    icon: FaBell,
    current: false,
    roles: ["Teacher"],
  },
  {
    name: "Attendance",
    to: "/school/staff-attendance-view",
    icon: FaBell,
    current: false,
    roles: ["Staff"],
  },
  {
    name: "Notice",
    to: "/notice",
    icon: FaBell,
    current: false,
    roles: ["Admin", "Teacher", "Student", "Parent"],
    children: [
      {
        name: "Create Notice",
        to: "/school/create-notice",
        icon: FaUser,
        roles: ["Admin"],
      },
      {
        name: "View All Notices",
        to: "/school/view-notice",
        icon: FaBook,
        roles: ["Student", "Teacher", "Admin", "Parent"],
      },
    ],
  },
  {
    name: "Setting",
    to: "/setting",
    icon: FaBell,
    current: false,
    roles: ["Admin"],
    children: [
      {
        name: "Contact Information",
        to: "/school/add-conatct-information",
        icon: FaBook,
        roles: ["Admin"],
      },
    ],
  },
];
