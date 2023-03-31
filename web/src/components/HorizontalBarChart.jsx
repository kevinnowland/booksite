import React, { useRef, useEffect } from "react";
import "../assets/HorizontalBarChart.css";
import * as d3 from "d3";

const barArray = [
  ["New York City", 10],
  ["Columbus", 7],
  ["Austin", 1],
  ["Philadelphia", 1],
  ["Portland", 1],
];

function HorizontalBarChart() {
  const xAxisRef = useRef();
  const yAxisRef = useRef();
  const barsRef = useRef();

  const margin = { top: 40, right: 60, bottom: 60, left: 120 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const maxBooks = barArray[0][1];
  const cities = barArray.map((d) => d[0]);
  const rects = barArray.map((i, _) => <rect key={i} fill="#f28c28" />);

  useEffect(() => {
    // x-axis
    const gXAxis = d3.select(xAxisRef.current);
    const xScale = d3.scaleLinear().domain([0, maxBooks]).range([0, width]);
    const xAxis = d3.axisBottom(xScale);
    gXAxis.call(xAxis);

    const gYAxis = d3.select(yAxisRef.current);
    const yScale = d3
      .scaleBand()
      .range([0, height])
      .domain(cities)
      .padding(0.1);
    const yAxis = d3.axisLeft(yScale);
    gYAxis.call(yAxis);

    const gBars = d3.select(barsRef.current);
    gBars
      .selectAll("rect")
      .data(barArray)
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
          <g
            className="xAxis"
            transform={`translate(0, ${height})`}
            ref={xAxisRef}
          />
          <g className="yAxis" ref={yAxisRef} />
          <g className="bars" ref={barsRef}>
            {rects}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default HorizontalBarChart;
