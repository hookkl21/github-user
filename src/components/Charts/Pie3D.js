import React, { Component } from "react";

import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

//charts will be changed
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ChartComponent = ({ data }) => {
  const chartConfigs = {
    type: "pie3d",
    width: "100%",
    height: 400,
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Languages",
        theme: "fusion",
        pieRadius: "35%",
        // paletteColors: "#f0db4f",
      },
      //shorthand data:data
      data,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default ChartComponent;
