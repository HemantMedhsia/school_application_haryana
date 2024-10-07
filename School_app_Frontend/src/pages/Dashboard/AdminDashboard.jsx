import React, { useEffect, useState } from "react";
import TrafficChart from "../../common/Charts/TrafficChart";
import BarChart from "../../common/Charts/BarChart";
import SmalldataBlock from "../../common/DataBlock/SmalldataBlock";
import StackedBarChart from "../../common/Charts/StackedBarChart";
import { getAPI } from "../../utility/api/apiCall";

const seriesData = [
  {
    name: "Marine Sprite",
    data: [44, 55, 41],
  },
  {
    name: "Striking Calf",
    data: [53, 32, 33],
  },
  {
    name: "Tank Picture",
    data: [12, 17, 11],
  },
];

const categoriesData = ["Paid", "Unpaid", "Partial Paid"];

const trafficChartColors = ["#65FA9E", "#286C56"];
const barChartColors = ["#FF4560", "#00E396"];
const stackedBarChartColors = [
  "#FF4560",
  "#00E396",
  "#775DD0",
  "#008FFB",
  "#FEB019",
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState({
    trafficChart: {
      series: [0, 0],
      labels: ["Male", "Female"],
      innerLable: "Total Students",
    },
    barChart: [],
  });

  const [teacherData, setTeacherData] = useState({
    trafficChart: {
      series: [0, 0],
      labels: ["Male", "Female"],
      innerLable: "Total Teachers",
    },
    barChart: [],
  });

  const [staffData, setStaffData] = useState({
    trafficChart: {
      series: [0, 0],
      labels: ["Male", "Female"],
      innerLable: "Total Staff",
    },
    barChart: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentResult, teacherResult, staffResult] = await Promise.all([
          getAPI("getAllStudentWithAttendance", {}, (result) => result),
          getAPI("getAllTeacherWithAttendance", {}, (result) => result),
          getAPI("getAllStaffWithAttendance", {}, (result) => result),
        ]);

        if (studentResult.success) {
          const { attendanceData, totalMaleStudents, totalFemaleStudents } =
            studentResult.data;
          setStudentData({
            trafficChart: {
              series: [totalMaleStudents, totalFemaleStudents],
              labels: ["Male", "Female"],
              innerLable: "Total Students",
            },
            barChart: attendanceData,
          });
        }

        if (teacherResult.success) {
          const { attendanceData, totalMaleTeachers, totalFemaleTeachers } =
            teacherResult.data;
          setTeacherData({
            trafficChart: {
              series: [totalMaleTeachers, totalFemaleTeachers],
              labels: ["Male", "Female"],
              innerLable: "Total Teachers",
            },
            barChart: attendanceData,
          });
        }

        if (staffResult.success) {
          const { attendanceData, totalMaleStaffs, totalFemaleStaffs } =
            staffResult.data;
          setStaffData({
            trafficChart: {
              series: [totalMaleStaffs, totalFemaleStaffs],
              labels: ["Male", "Female"],
              innerLable: "Total Staff",
            },
            barChart: attendanceData,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className=" lg:p-0">
      <div className="sm:flex">
        <div className="flex flex-wrap justify-center gap-4 mb-4 lg:w-1/3">
          <div className="w-full ">
            <SmalldataBlock
              title="Monthly Expense"
              description="Total number of Expense this month"
              iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
              bgColor="bg-gray-900"
              value={200000}
            />
          </div>

          <div className="w-full">
            <SmalldataBlock
              title="Monthly Fees Collection"
              description="Total number of Expense this month"
              iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
              bgColor="bg-gray-900"
              value={500000}
            />
          </div>
          <div className="w-full ">
            <SmalldataBlock
              title="Total Donation"
              description="Total number of Expense this month"
              iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
              bgColor="bg-gray-900"
              value={50000}
            />
          </div>
        </div>
        <div className="lg:w-1/2">
          <StackedBarChart
            series={seriesData}
            categories={categoriesData}
            chartTitle="Fiction Books Sales"
            colors={["#FF4560", "#00E396", "#775DD0", "#008FFB", "#FEB019"]}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[300px] border-4 border-[#283046] rounded-md">
          <TrafficChart
            series={studentData.trafficChart.series}
            colors={trafficChartColors}
            labels={studentData.trafficChart.labels}
            title="Total Students"
            height={320}
            width="100%"
            containerId="custom-donut-chart"
            innerTextOfDonut={"Total Students"}
          />
          <BarChart
            label="Student Weekly Attendance"
            series={studentData.barChart}
            colors={barChartColors}
            height="100%"
            width="100%"
          />
        </div>
        <div className="flex-1 min-w-[300px] border-4 border-[#283046] rounded-md">
          <TrafficChart
            series={teacherData.trafficChart.series}
            colors={trafficChartColors}
            labels={teacherData.trafficChart.labels}
            title="Total Teachers"
            height={320}
            width="100%"
            containerId="custom-donut-chart2"
            innerTextOfDonut={"Total Teachers"}
          />
          <BarChart
            label="Teacher Weekly Attendance"
            series={teacherData.barChart}
            colors={barChartColors}
            height="100%"
            width="100%"
          />
        </div>
        <div className="flex-1 min-w-[300px] border-4 border-[#283046] rounded-md">
          <TrafficChart
            series={staffData.trafficChart.series}
            colors={trafficChartColors}
            labels={staffData.trafficChart.labels}
            title="Total Staff"
            height={320}
            width="100%"
            containerId="custom-donut-chart3"
            innerTextOfDonut={"Total Staff"}
          />
          <BarChart
            label="Staff Weekly Attendance"
            series={staffData.barChart}
            colors={barChartColors}
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
