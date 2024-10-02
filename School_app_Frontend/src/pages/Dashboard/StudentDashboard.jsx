// Updated StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import SmalldataBlock from "../../common/DataBlock/SmalldataBlock";
import RadialBarChart from "../../common/Charts/RadialBarChart";
import NoticeShowingBlock from "../../common/DataBlock/NoticeShowingBlock";
import ComplaintShowingBlock from "../../common/DataBlock/ComplaintShowingBlock";
import StudentTimeTable from "../../components/StudentDashBoard/StudentTimeTable";
import { getAPI } from "../../utility/api/apiCall";

const complaints = [
  {
    id: 1,
    category: "Behavior",
    description:
      "Student is frequently disruptive in class and does not follow instructions.",
    status: "Pending",
  },
  {
    id: 2,
    category: "Homework",
    description: "Student consistently fails to submit homework on time.",
    status: "Resolved",
  },
  {
    id: 3,
    category: "Attendance",
    description:
      "Student has been absent multiple times without a valid excuse.",
    status: "In Progress",
  },
  {
    id: 4,
    category: "Academics",
    description:
      "Student is not performing up to potential and needs additional support.",
    status: "Pending",
  },
];

const StudentDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [studentAttendanceInfo, setStudentAttendanceInfo] = useState([]);
  const [studentComplaints, setStudentComplaints] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      await getAPI("getAllNotices", {}, setNotices);
      await getAPI("getStudentAttendanceInfo", {}, setStudentAttendanceInfo);
      const res = await getAPI(
        "getComplaintsByStudent",
        {},
        setStudentComplaints
      );

      console.log(studentComplaints);
    };
    fetchNotices();
  }, []);

  return (
    <div className="flex justify-between w-full gap-6">
      <div className="w-4/6">
        <div className="flex w-full gap-4">
          <SmalldataBlock
            title="Classes"
            description="Total number of classes"
            iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
            bgColor="bg-gray-900"
            value={studentAttendanceInfo.totalClasses}
          />
          <SmalldataBlock
            title="Present"
            description="Total number of Present"
            iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
            bgColor="bg-gray-900"
            value={studentAttendanceInfo.present}
          />
        </div>
        <div className="flex w-full gap-4">
          <SmalldataBlock
            title="Absent"
            description="Total number of absent"
            iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
            bgColor="bg-gray-900"
            value={studentAttendanceInfo.absent}
          />
          <SmalldataBlock
            title="Late"
            description="Total number of late"
            iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
            bgColor="bg-gray-900"
            value={0}
          />
        </div>
        <div className=" bg-[#283046] p-8 rounded-md">
          <h1 className="text-[#7367F0] text-xl font-semibold my-2">Notices</h1>
          <NoticeShowingBlock notices={notices} />
        </div>
        <div className=" mt-4 bg-[#283046] p-8 rounded-md">
          <h1 className="text-[#7367F0] text-xl font-semibold my-8">
            Student complaints
          </h1>
          <ComplaintShowingBlock complaints={studentComplaints} />
        </div>
      </div>
      <div className="w-1/3 h-1/3">
        <div className="w-full h-full p-2 bg-[#283046] flex flex-col  items-center rounded-lg shadow-md">
          <div>
            <h1 className="text-[#7367F0] text-xl font-semibold">
              Attendance percentage
            </h1>
            <RadialBarChart
              height="500"
              series={[studentAttendanceInfo.percentage]}
            />
          </div>
        </div>

        <div className="w-full h-full p-2 mt-4 bg-[#283046] flex flex-col  items-center rounded-lg shadow-md">
          <StudentTimeTable />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
