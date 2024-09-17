import React from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = ({ series, colors, height = "400px", width = "100%", label }) => {
  const options = {
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      responsive: [
        {
          breakpoint: 1000,
          options: {
            chart: {
              width: "100%",
              height: "350px", // Adjust height for smaller screens
            }
          }
        },
        {
          breakpoint: 600,
          options: {
            chart: {
              width: "100%",
              height: "300px", // Further adjust height for very small screens
            }
          }
        }
      ]
    },
    colors,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#FFFFFF',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        }
      }
    }
  };

  return (
    <div className="w-full max-w-full rounded-md shadow p-4 md:p-6 bg-gray-900">
      <h1 className="text-white text-lg font-semibold mb-4">{label}</h1>
      <ReactApexChart options={options} series={series} type="bar" height={height} width={width} />
    </div>
  );
};

export default BarChart;
