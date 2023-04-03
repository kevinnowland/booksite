import React, { useRef, useEffect, useState, useCallback } from "react";
import "../assets/HorizontalBarChart.css";
import publisherCities from "../data/publisher_cities_list.json";
import * as d3 from "d3";
import { getCityStateAbbrev } from "../common/utils";
import _ from "lodash";

// TODO: unit test
function countTitles(city) {
  return city.publishers.reduce((acc, pub) => acc + pub.titles.length, 0);
}

// TODO: unit test
function compareCities(a, b) {
  const diff = b[1] - a[1];
  if (diff !== 0) {
    return diff;
  } else {
    return a[0].localeCompare(b[0]);
  }
}

function Rect(props) {
  const [fillColor, setFillColor] = useState("#f28c28");
  const [opacity, setOpacity] = useState(0);
  const [mousePos, setMousePos] = useState({ x: null, y: null });

  const handleMouseOver = () => {
    setFillColor("#ffa836");
    setOpacity(1);
  };
  const handleMouseOut = () => {
    setFillColor("#f28c28");
    setOpacity(0);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMouseMove = useCallback(
    _.throttle((e) => {
      setMousePos({
        x: e.nativeEvent.offsetX - 100,
        y: e.nativeEvent.offsetY - 60,
      });
    }, 16),
    []
  );

  return (
    <g>
      <rect
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onMouseMove={handleMouseMove}
        fill={fillColor}
        x={props.x}
        y={props.y}
        width={props.barWidth}
        height={props.barHeight}
      />
      <foreignObject
        x={mousePos.x}
        y={mousePos.y}
        height="50px"
        width="100px"
        opacity={opacity}
        pointerEvents="None"
      >
        <div xmlns="http://www.w3.org/1999/xhtml" className="tooltip">
          {props.numBooks}
        </div>
      </foreignObject>
    </g>
  );
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
  // refs for d3 to use
  const xAxisRef = useRef();
  const yAxisRef = useRef();

  // svg heights
  const margin = { top: 40, right: 60, bottom: 60, left: 120 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // data
  const barData = getBarData();
  const maxBooks = barData[0][1];
  const cities = barData.map((d) => d[0]);

  // d3 functions
  const xScale = d3.scaleLinear().domain([0, maxBooks]).range([0, width]);
  const xAxis = d3.axisBottom(xScale);
  const yScale = d3.scaleBand().range([0, height]).domain(cities).padding(0.1);
  const yAxis = d3.axisLeft(yScale);

  // some elements
  const rects = barData.map((d, i) => {
    return (
      <Rect
        key={i}
        numBooks={d[1]}
        x={xScale(0)}
        y={yScale(d[0])}
        barWidth={xScale(d[1])}
        barHeight={yScale.bandwidth()}
        svgWidth={width}
        svgHeight={height}
      />
    );
  });

  useEffect(() => {
    d3.select(xAxisRef.current).call(xAxis);
    d3.select(yAxisRef.current).call(yAxis);
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
          <g className="bars">{rects}</g>
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
