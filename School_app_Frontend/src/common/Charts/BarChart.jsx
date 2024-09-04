import React, { lazy, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = ({ series, colors, height }) => {
  const options = {
    chart: {
      type: 'bar',
      height,
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
          colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'], // Array of colors for each day
          fontSize: '12px', // Optional: set the font size
          fontFamily: 'Inter, sans-serif', // Optional: set the font family
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

  return <ReactApexChart options={options} series={series} type="bar" height={height} width={"900px"} />;
};

export default BarChart;