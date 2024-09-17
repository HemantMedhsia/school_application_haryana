import React from "react";
import ReactApexChart from "react-apexcharts";

const StackedBarChart = ({
  series,
  categories,
  chartHeight = 350,
  chartTitle = "Chart Title",
  colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
  barHeight = "90%",
}) => {
  const options = {
    chart: {
      type: "bar",
      height: chartHeight,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "14px", // Adjusted for better readability on mobile
              fontWeight: 700,
              colors: ["#ff00ff"], // Change this to your desired color
            },
            formatter: function (val) {
              return val;
            },
          },
        },
        barHeight: barHeight,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    title: {
      text: chartTitle,
      align: "left",
      style: {
        fontSize: "16px", // Adjusted for better readability on mobile
        fontWeight: "bold",
        color: "#7367F0",
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: function (val) {
          return val + "K";
        },
        style: {
          colors: "#ffffff",
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K";
        },
      },
    },
    fill: {
      opacity: 1,
      colors: colors,
    },
    legend: {
      position: "bottom", // Moved legend to bottom for better mobile view
      horizontalAlign: "center",
      offsetX: 0,
      labels: {
        colors: "#ffffff",
      },
    },
  };

  return (
    <div className="ml-4 bg-gray-900 rounded-lg w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={chartHeight}
      />
    </div>
  );
};

export default StackedBarChart;
