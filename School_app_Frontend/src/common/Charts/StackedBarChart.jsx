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
              fontSize: "16px",
              fontWeight: 900,
              colors: ["#ff00ff"], // Change this to your desired color
            },
            formatter: function (val) {
              return val; // Change this to your desired color
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
        fontSize: "20px",
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
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
      labels: {
        colors: "#ffffff",
      },
    },
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
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
