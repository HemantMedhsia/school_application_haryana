import React from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = ({ series, colors, height, width, label }) => {
  const options = {
    chart: {
      type: 'bar',
      height,
      width,
      responsive: [{
        breakpoint: 1000,
        options: {
          chart: {
            width: "90%",
            height: "90%",
          }
        }
      }]
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
          colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
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
    <div className="w-2/3 rounded-md shadow p-4 md:p-6">
      <h1 className="text-white text-lg font-semibold">{label}</h1>
      <ReactApexChart options={options} series={series} type="bar" height={height} width={width} />
    </div>
  );
};

export default BarChart;
