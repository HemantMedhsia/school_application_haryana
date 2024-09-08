// RadialBarChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const RadialBarChart = ({
  series = [75],
  labels = ['Percent'],
  height = 350,
  startAngle = -135,
  endAngle = 225,
  hollowSize = '70%',
  hollowBackground = '#fff',
  dropShadow = true,
  dropShadowOptions = {
    top: 3,
    left: 0,
    blur: 4,
    opacity: 0.24,
  },
  trackBackground = '#fff',
  trackStrokeWidth = '67%',
  gradientFromColor = '#ABE5A1',
  gradientToColor = '#ABE5A1',
  gradientShade = 'dark',
  gradientType = 'horizontal',
  gradientShadeIntensity = 0.5,
  gradientStops = [0, 100],
  dataLabelNameColor = '#888',
  dataLabelNameFontSize = '17px',
  dataLabelValueColor = '#111',
  dataLabelValueFontSize = '36px',
}) => {
  const options = {
    series,
    chart: {
      height,
      type: 'radialBar',
      toolbar: {
        show: true,
      },
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
