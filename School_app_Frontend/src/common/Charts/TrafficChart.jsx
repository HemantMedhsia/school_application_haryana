import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

const TrafficChart = ({
  series = [35.1, 23.5, 2.4, 5.4], // Default series data
  colors, // Default colors
  labels = ["Direct", "Sponsor", "Affiliate", "Email marketing"], // Default labels
  title = "Website Traffic", // Default title
  height = 320, // Chart height
  width = "100%", // Chart width
  containerId = "donut-chart", // Default container ID
  innerLable = "Unique visitors", // Default inner label
}) => {
  const adjustedColors = Array(series.length).fill().map((_, i) => colors[i % colors.length]);

  const numberOfLabels = colors.length; // Replace with the actual number of labels
  const labelColors = Array(numberOfLabels).fill("white");

  // Dynamically set chart options using props
  const getChartOptions = () => ({
    series,
    colors : adjustedColors,
    chart: {
      height,
      width,
      type: "donut",
    },
    stroke: {
      colors: ["transparent"],
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: 20,
              color: "white",
            },
            total: {
              showAlways: true,
              show: true,
              label: innerLable,
              fontFamily: "Inter, sans-serif",
              color: "white",
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `$${sum}k`;
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              color: "white",
              offsetY: -20,
              formatter: function (value) {
                return `${value}k`;
              },
            },
          },
          size: "80%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels,
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      markers: {
        width: 8,
        height: 8,
      },
      itemMargin: {
        horizontal: 8,
      },
      labels: {
        colors: labelColors, // Set the desired color here
      },
    },
  });

  useEffect(() => {
    if (
      document.getElementById(containerId) &&
      typeof ApexCharts !== "undefined"
    ) {
      const chart = new ApexCharts(
        document.getElementById(containerId),
        getChartOptions()
      );
      chart.render();

      // Cleanup the chart on component unmount
      return () => {
        chart.destroy();
      };
    }
  }, [series, colors, labels, height, width, containerId]);

  return (
    <div className="max-w-sm w-full bg-[#283046] rounded-lg shadow p-4 md:p-6">
      <div className="flex justify-between mb-3">
        <div className="flex items-center">
          <h5 className="text-xl font-bold leading-none text-white">{title}</h5>
        </div>
      </div>
      <div className="py-6" id={containerId}></div>
    </div>
  );
};

export default TrafficChart;
