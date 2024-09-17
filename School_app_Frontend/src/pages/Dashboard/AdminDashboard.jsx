import React from "react";
import TrafficChart from "../../common/Charts/TrafficChart";
import BarChart from "../../common/Charts/BarChart";
import SmalldataBlock from "../../common/DataBlock/SmalldataBlock";
import StackedBarChart from "../../common/Charts/StackedBarChart";

const trafficChartData = {
  series: [200, 250],
  colors: ["#65FA9E", "#286C56"],
  labels: ["Male", "Female"],
  title: "Total Students",
  height: 320,
  width: "100%",
  containerId: "custom-donut-chart",
  innerLable: "Total Students",
};

const trafficChartData2 = {
  series: [200, 250],
  colors: ["#65FA9E", "#286C56"],
  labels: ["Male", "Female"],
  title: "Total Teachers",
  height: 320,
  width: "100%",
  containerId: "custom-donut-chart2",
  innerLable: "Total Teachers",
};

const trafficChartData3 = {
  series: [200, 250],
  colors: ["#65FA9E", "#286C56"],
  labels: ["Male", "Female"],
  title: "Total Staffs",
  height: 320,
  width: "100%",
  containerId: "custom-donut-chart3",
  innerLable: "Total Staffs",
};

const barChartData = [
  {
    name: "Male",
    data: [30, 40, 35, 50, 49, 60, 0],
  },
  {
    name: "Female",
    data: [12, 40, 16, 50, 49, 60, 0],
  },
];

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

const barChartColors = ["#FF4560", "#00E396"];

const AdminDashboard = () => {
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
          <TrafficChart {...trafficChartData} />
          <BarChart
            label={"Student Weekly Attendance"}
            series={barChartData}
            colors={barChartColors}
            height={"100%"}
            width="100%"
          />
        </div>
        <div className="flex-1 min-w-[300px] border-4 border-[#283046] rounded-md">
          <TrafficChart {...trafficChartData2} />
          <BarChart
            label={"Teacher Weekly Attendance"}
            series={barChartData}
            colors={barChartColors}
            height={"100%"}
            width="100%"
          />
        </div>
        <div className="flex-1 min-w-[300px] border-4 border-[#283046] rounded-md">
          <TrafficChart {...trafficChartData3} />
          <BarChart
            label={"Staff Weekly Attendance"}
            series={barChartData}
            colors={barChartColors}
            height={"100%"}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
