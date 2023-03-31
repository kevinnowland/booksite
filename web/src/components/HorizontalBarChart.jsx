import React, { useRef, useEffect } from "react";
import "../assets/HorizontalBarChart.css";
import publisherCities from "../data/publisher_cities_list.json";
import * as d3 from "d3";
import { getCityStateAbbrev } from "../common/utils";

function countTitles(city) {
  return city.publishers.reduce((acc, pub) => acc + pub.titles.length, 0);
}

function compareCities(a, b) {
  const diff = b[1] - a[1];
  if (diff !== 0) {
    return diff;
  } else {
    return a[0].localeCompare(b[0]);
  }
}

function Rect() {
  return <rect fill="#f28c28" />;
}

function getBarData() {
  var data = publisherCities.cities.map((c) => [
    getCityStateAbbrev(c.name, c.state),
    countTitles(c),
  ]);

  data.sort(compareCities);

  return data;
}

function HorizontalBarChart() {
  const xAxisRef = useRef();
  const yAxisRef = useRef();
  const barsRef = useRef();

  const barData = getBarData();

  const margin = { top: 40, right: 60, bottom: 60, left: 120 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const maxBooks = barData[0][1];
  const cities = barData.map((d) => d[0]);
  const rects = barData.map((i, _) => <Rect key={i} />);

  useEffect(() => {
    var gXAxis = d3.select(xAxisRef.current);
    const xScale = d3.scaleLinear().domain([0, maxBooks]).range([0, width]);
    const xAxis = d3.axisBottom(xScale);
    gXAxis.call(xAxis);

    var gYAxis = d3.select(yAxisRef.current);
    const yScale = d3
      .scaleBand()
      .range([0, height])
      .domain(cities)
      .padding(0.1);
    const yAxis = d3.axisLeft(yScale);
    gYAxis.call(yAxis);

    var gBars = d3.select(barsRef.current);
    gBars
      .selectAll("rect")
      .data(barData)
      .attr("x", xScale(0))
      .attr("y", (d) => yScale(d[0]))
      .attr("width", (d) => xScale(d[1]))
      .attr("height", yScale.bandwidth());
  });

  return (
    <div className="barChart">
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
        className="barChart"
      >
        <g
          className="barChart"
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <g className="bars" ref={barsRef}>
            {rects}
          </g>
          <g
            className="xAxis"
            transform={`translate(0, ${height})`}
            ref={xAxisRef}
          >
            <text
              className="xTitle"
              //textAnchor="middle"
              transform={`translate(${width / 2}, 50)`}
              fill="black"
              fontSize="20px"
            >
              published books read
            </text>{" "}
          </g>
          <g className="yAxis" ref={yAxisRef} />
        </g>
      </svg>
    </div>
  );
}

export default HorizontalBarChart;
