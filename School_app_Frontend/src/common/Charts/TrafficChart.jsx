import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

const TrafficChart = ({
  series = [35.1, 23.5, 2.4, 5.4],
  colors,
  labels = ["Direct", "Sponsor", "Affiliate", "Email marketing"],
  title = "Website Traffic",
  height = "300px", // Default height for better mobile visibility
  width = "100%", // Full width for responsive design
  containerId = "donut-chart",
  innerTextOfDonut = "Traffic Sources",
}) => {
  const adjustedColors = Array(series.length).fill().map((_, i) => colors[i % colors.length]);

  const numberOfLabels = colors.length;
  const labelColors = Array(numberOfLabels).fill("white");

  const getChartOptions = () => ({
    series,
    colors: adjustedColors,
    chart: {
      type: "donut",
      height: "100%",
      width: "100%",
      responsive: [{
        breakpoint: 1000,
        options: {
          chart: {
            width: "100%",
            height: "100%",
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            itemMargin: {
              horizontal: 8,
            },
          },
        }
      }, {
        breakpoint: 600,
        options: {
          chart: {
            width: "100%",
            height: "100%",
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            itemMargin: {
              horizontal: 4,
            },
          },
        }
      }],
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
              label: innerTextOfDonut,
              fontFamily: "Inter, sans-serif",
              color: "white",
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `${sum}`;
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              color: "white",
              offsetY: -20,
              formatter: function (value) {
                return `${value}`;
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
        colors: labelColors,
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

      return () => {
        chart.destroy();
      };
    }
  }, [series, colors, labels, height, width, containerId]);

  return (
    <div className="w-full max-w-full p-4 rounded-md shadow-lg bg-gray-900">
      <div className="flex justify-between mb-3">
        <h5 className="text-xl font-bold leading-none text-white">{title}</h5>
      </div>
      <div id={containerId} style={{ height: height, width: width }}></div>
    </div>
  );
};

export default TrafficChart;
