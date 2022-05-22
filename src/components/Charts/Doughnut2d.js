import React, { Component } from "react";

import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy";

//charts will be changed
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ChartComponent = ({ data }) => {
  const chartConfigs = {
    type: "doughnut2d",
    width: "100%",
    height: 400,
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Stars Per Language",
        theme: "candy",
        doughnutRadius: "45%",
        decimals: 0,
        showPercentValues: 0,
        // paletteColors: "#f0db4f",
      },
      //shorthand data:data
      data,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default ChartComponent;
