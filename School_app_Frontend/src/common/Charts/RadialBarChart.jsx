// RadialBarChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const RadialBarChart = ({
  series = [75],
  labels = ['Percent'],
  height = 350,
  startAngle = -135,
  endAngle = 225,
  hollowSize = '80%',
  hollowBackground = '#283046',
  dropShadow = true,
  dropShadowOptions = {
    top: 3,
    left: 0,
    blur: 4,
    opacity: 0.24,
  },

  trackBackground = '#283046',
  trackStrokeWidth = '67%',
  gradientFromColor = '#ABE5A1',
  gradientToColor = '#ABE5A1',
  gradientShade = 'dark',
  gradientType = 'horizontal',
  gradientShadeIntensity = 0.5,
  gradientStops = [0, 100],
  dataLabelNameColor = '#7367F0',
  dataLabelNameFontSize = '20px',
  dataLabelValueColor = '#65FA9E',
  dataLabelValueFontSize = '36px',
  chartBackground = '#283046', // Modify the background color here
}) => {
  const options = {
    series,
    chart: {
      height,
      type: 'radialBar',
      toolbar: {
        show: true,
      },
      background: chartBackground, // Set the background color here
    },
    plotOptions: {
      radialBar: {
        startAngle,
        endAngle,
        hollow: {
          margin: 0,
          size: hollowSize,
          background: hollowBackground,
          position: 'front',
          dropShadow: dropShadow
            ? {
                enabled: true,
                ...dropShadowOptions,
              }
            : {
                enabled: false,
              },
        },
        track: {
          background: trackBackground,
          strokeWidth: trackStrokeWidth,
          margin: 0,
          dropShadow: dropShadow
            ? {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35,
              }
            : {
                enabled: false,
              },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: dataLabelNameColor,
            fontSize: dataLabelNameFontSize,
          },
          value: {
            formatter: (val) => parseInt(val),
            color: dataLabelValueColor,
            fontSize: dataLabelValueFontSize,
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: gradientShade,
        type: gradientType,
        shadeIntensity: gradientShadeIntensity,
        gradientToColors: [gradientToColor],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: gradientStops,
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels,
  };

  return <Chart options={options} series={series} type="radialBar" height={height} />;
};

export default RadialBarChart;
