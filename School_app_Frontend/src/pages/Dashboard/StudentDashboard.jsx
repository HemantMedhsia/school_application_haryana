// Updated StudentDashboard.jsx
import React from "react";
import SmalldataBlock from "../../common/DataBlock/SmalldataBlock";
import RadialBarChart from "../../common/Charts/RadialBarChart";
import NoticeShowingBlock from "../../common/DataBlock/NoticeShowingBlock";
import ComplaintShowingBlock from "../../common/DataBlock/ComplaintShowingBlock";
import StudentTimeTable from "../../components/StudentDashBoard/StudentTimeTable";

const notices = [
  {
    id: "1",
    title: "Annual Sports Day",
    category: "Event",
    date: "10-12-2024",
    description:
      "Join us for the Annual Sports Day at the school ground. Students from all classes are encouraged to participate in various events. Parents are welcome to attend.",
  },
  {
    id: "2",
    title: "Diwali Holidays",
    category: "Holiday",
    date: "01-11-2024",
    description:
      "The school will remain closed from November 1st to November 6th on account of Diwali. Classes will resume on November 7th. Happy Diwali to everyone!",
  },
  {
    id: "3",
    title: "PTM Scheduled",
    category: "Announcement",
    date: "20-12-2024",
    description:
      "A Parent-Teacher Meeting (PTM) is scheduled for September 20th. All parents are requested to attend the meeting to discuss their ward’s progress and areas of improvement.",
  },
  {
    id: "4",
    title: "Library Book Return Reminder",
    category: "General",
    date: "05-09-2024",
    description:
      "Students are reminded to return all library books by the end of this month. Late returns will incur a fine. Please check the due dates to avoid any penalties.",
  },
];

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
  return (
    <div className="flex justify-between w-full gap-6">
      <div className="w-4/6">
        <div className="flex w-full gap-4">
          <SmalldataBlock
            title="Classes"
            description="Total number of classes"
            iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
            bgColor="bg-gray-900"
            value={200}
          />
          <SmalldataBlock
            title="Present"
            description="Total number of Present"
            iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
            bgColor="bg-gray-900"
            value={200}
          />
        </div>
        <div className="flex w-full gap-4">
          <SmalldataBlock
            title="Absent"
            description="Total number of absent"
            iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
            bgColor="bg-gray-900"
            value={200}
          />
          <SmalldataBlock
            title="Late"
            description="Total number of late"
            iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
            bgColor="bg-gray-900"
            value={50}
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
          <ComplaintShowingBlock complaints={complaints} />
        </div>
      </div>
      <div className="w-1/3 h-1/3">
        <div className="w-full h-full p-2 bg-[#283046] flex flex-col  items-center rounded-lg shadow-md">
          <div>
            <h1 className="text-[#7367F0] text-xl font-semibold">
              Attendance Percentage
            </h1>
            <RadialBarChart height="500" />
          </div>
        </div>

        <div className="w-full h-full p-2 mt-4 bg-[#283046] flex flex-col  items-center rounded-lg shadow-md">
          <StudentTimeTable/>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
