import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  Navigate,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Testing from "./pages/Testing.jsx";
import Dashboard from "./layouts/Navbar/Dashboard.jsx";
import RoleBasedAccess from "./pages/RoleBase/RoleBasedAccess.jsx";
import { useAuth } from "./context/AuthProvider.jsx";
import StudentAdd from "./pages/Student/StudentAdd.jsx";
import StudnetInfo from "./pages/Student/StudnetInfo.jsx";
import EventCalendar from "./pages/Calender/EventCalendar.jsx";
import Notice from "./pages/Notice/Notice.jsx";
import Profile from "./pages/Student/Profile.jsx";
import ParentAdd from "./pages/Parent/ParentAdd.jsx";
import ParentInfo from "./pages/Parent/ParentInfo.jsx";
import Attendence from "./pages/Attendence.jsx";
import ParentProfile from "./pages/Parent/ParentProfile.jsx";
import TeacherInfo from "./pages/Teacher/TeacherInfo.jsx";
import TeacherProfile from "./pages/Teacher/TeacherProfile.jsx";
import TeacherAdd from "./pages/Teacher/TeacherAdd.jsx";
import AddMarks from "./pages/Examination/AddMarks.jsx";
import CreateSection from "./pages/CreateSection.jsx";
import CreateClass from "./pages/CreateClass.jsx";
import AddSubjects from "./pages/AddSubjects.jsx";
import CreateSubjectGroup from "./pages/CreateSubjectGroup.jsx";
import ViewNotice from "./pages/Notice/ViewNotice.jsx";
import ExamGrpup from "./pages/Examination/ExamGrpup.jsx";
import ExamType from "./pages/Examination/ExamType.jsx";
import ExaminationSchedule from "./pages/Examination/ExaminationSchedule.jsx";
import ClassTimetable from "./pages/ClassTimetable.jsx";
import TeacherTimetable from "./pages/Teacher/TeacherTimetable.jsx";
import CreateTimetabel from "./pages/CreateTimetabel.jsx";
import AssingTeacher from "./pages/Teacher/AssingTeacher.jsx";
import ViewExaminationSchedule from "./pages/Examination/ViewExaminationSchedule.jsx";
import ViewMarks from "./pages/Examination/ViewMarks.jsx";
import ViewExaminationScheduleForStudentAndParent from "./pages/Examination/ViewExaminationScheduleForStudentAndParent.jsx";
import StaffAdd from "./pages/Staff/StaffAdd.jsx";
import StaffInfo from "./pages/Staff/StaffInfo.jsx";
import CommonClassTimeTable from "./pages/CommonClassTimeTable.jsx";
import StudentsResults from "./pages/Results/StudentsResults.jsx";
import ShowStudentResult from "./pages/Results/ShowStudentResult.jsx";
import StudentAttendance from "./pages/Student/StudentAttendance.jsx";
import TeacherAttendance from "./pages/Teacher/TeacherAttendance.jsx";
import StaffAttendance from "./pages/Staff/StaffAttendance.jsx";
import StudentAdmitCard from "./pages/Print/StudentAdmitCard.jsx";
import AdmitCardPrint from "./pages/Print/AdmitCardPrint.jsx";
import ResultPrint from "./pages/Print/ResultPrint.jsx";
import ContactDetails from "./pages/ContactDetails.jsx";
import ViewContact from "./pages/ViewContact.jsx";

const App = () => {
  const { userRole, authToken } = useAuth();

  const data = {
    commonInfo: {
      schoolName: "Green Valley High School",
      schoolLogo: "https://example.com/school-logo.png",
      term: "Term 1",
      examType: "Unit Test",
      examDetails: [
        {
          subject: "Science 101",
          examDate: "2024-01-01T00:00:00.000Z",
          startTime: "08:20",
          endTime: "10:20",
        },
        {
          subject: "Hindi",
          examDate: "2024-01-01T00:00:00.000Z",
          startTime: "08:20",
          endTime: "10:20",
        },
      ],
    },
    students: [
      {
        studentName: "Vedansh Tiwari",
        studentPhoto:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        rollNumber: "12",
      },
      {
        studentName: "Hemant Medhsia",
        studentPhoto:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        rollNumber: "122",
      },
      {
        studentName: "Aditya M",
        studentPhoto:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        rollNumber: "12df",
      },
    ],
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/school"
          element={authToken ? <Layout /> : <Navigate to="/" />}
        >
          <Route
            path="dashboard"
            element={
              // Uncomment to use RoleBasedAccess
              // <RoleBasedAccess allowedRoles={["admin", "student"]}>
              <Dashboard role={userRole} />
              // </RoleBasedAccess>
            }
          />
          <Route path="testing" element={<Testing />} />
          <Route
            path="student-admission/:studentId?"
            element={
              <RoleBasedAccess allowedRoles={["Admin", "Student"]}>
                {" "}
                <StudentAdd />
              </RoleBasedAccess>
            }
          />
          <Route path="parent-add/:Id" element={<ParentAdd />} />
          <Route path="student-information" element={<StudnetInfo />} />
          <Route path="staff-add" element={<StaffAdd />} />
          <Route path="all-staffs" element={<StaffInfo />} />
          <Route path="staff-update/:staffId" element={<StaffAdd />} />
          <Route path="parent-information" element={<ParentInfo />} />
          <Route path="calendar" element={<EventCalendar />} />
          <Route path="create-notice" element={<Notice />} />
          <Route path="profile/:studentId" element={<Profile />} />
          <Route path="attendance" element={<Attendence />} />
          <Route path="teacher-attendance" element={<TeacherAttendance />} />
          <Route path="staff-attendance" element={<StaffAttendance />} />
          <Route path="all-teachers" element={<TeacherInfo />} />
          <Route path="parent-profile/:parentId" element={<ParentProfile />} />
          <Route path="parent-update/:parentId" element={<ParentAdd />} />
          <Route
            path="parent-update-student/:studentId"
            element={<ParentAdd />}
          />
          <Route path="add-conatct-information" element={<ContactDetails />} />
          <Route
            path="teacher-profile/:teacherId"
            element={<TeacherProfile />}
          />
          <Route path="teacher-update/:teacherId" element={<TeacherAdd />} />
          <Route path="teacher-add" element={<TeacherAdd />} />
          <Route path="add-marks" element={<AddMarks />} />
          <Route path="create-section" element={<CreateSection />} />
          <Route path="create-class" element={<CreateClass />} />
          <Route path="add-subjects" element={<AddSubjects />} />
          <Route path="create-subject-group" element={<CreateSubjectGroup />} />
          <Route path="view-notice" element={<ViewNotice />} />
          <Route path="exam-group" element={<ExamGrpup />} />
          <Route path="exam-type" element={<ExamType />} />
          <Route path="exam-schedule" element={<ExaminationSchedule />} />
          <Route path="class-timetable" element={<ClassTimetable />} />
          <Route path="view-contact" element={<ViewContact />} />

          <Route
            path="class-timetable-user"
            element={<CommonClassTimeTable />}
          />
          <Route path="teacher-timetable" element={<TeacherTimetable />} />
          <Route path="create-timetable" element={<CreateTimetabel />} />
          <Route path="assign-teacher" element={<AssingTeacher />} />
          <Route path="students-results" element={<StudentsResults />} />
          <Route
            path="view-exam-schedule"
            element={<ViewExaminationSchedule />}
          />
          <Route path="view-marks" element={<ViewMarks />} />
          <Route
            path="view-exam-schedule-student-and-parent"
            element={<ViewExaminationScheduleForStudentAndParent />}
          />
          <Route path="view-result" element={<ShowStudentResult />} />
          <Route
            path="student-attendance-view/:studentId?"
            element={
              <RoleBasedAccess allowedRoles={["Admin", "Student", "Parent"]}>
                <StudentAttendance />
              </RoleBasedAccess>
            }
          />
          <Route
            path="teacher-attendance-view/:teacherId?"
            element={
              <RoleBasedAccess allowedRoles={["Admin", "Teacher"]}>
                <StudentAttendance />
              </RoleBasedAccess>
            }
          />
          <Route
            path="staff-attendance-view/:staffId?"
            element={
              <RoleBasedAccess allowedRoles={["Admin", "Staff"]}>
                <StudentAttendance />
              </RoleBasedAccess>
            }
          />
          <Route
            path="/school/print"
            element={
              <AdmitCardPrint
                students={data.students}
                commonInfo={data.commonInfo}
              />
            }
          />
          <Route path="/school/resultp" element={<ResultPrint />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
