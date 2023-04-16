import React, { useState } from "react";
import "../assets/DotChart.css";
import { getColor } from "../common/colors";

function CircleSequence(props) {
  const n = props.n;
  const shift = props.shift;
  const fill = props.fill;
  const circlesPerRow = props.circlesPerRow;
  const r = props.r;

  let coords = [];
  for (let i = shift; i < n + shift; i++) {
    let row = Math.floor(i / circlesPerRow);
    let col = i % circlesPerRow;
    coords.push({
      cx: r * (2 * col + 1),
      cy: r * (2 * row + 1),
    });
  }

  const circles = coords.map((d, i) => {
    return <circle key={i} cx={d.cx} cy={d.cy} r={r} fill={fill} />;
  });

  return <g className="circleSequence">{circles}</g>;
}

function DotChart(props) {
  // props
  const width = props.width;
  const data = props.data;
  const title = props.title;
  const circlesPerRow = props.circlesPerRow;

  // calculated
  const radius = width / (2 * circlesPerRow);
  const nCircles = data.publishers.reduce((acc, d) => acc + d.n, 0);
  const nRows = Math.floor(nCircles / circlesPerRow) + 1;
  const height = 2 * radius * nRows;

  // use getColor
  let shifts = [0];
  for (let i = 0; i < data.publishers.length - 1; i++) {
    shifts.push(shifts[i] + data.publishers[i].n);
  }
  const circles = data.publishers.map((d, i) => {
    return (
      <CircleSequence
        key={i}
        r={radius}
        fill={d.isIndependent ? getColor(i) : "grey"}
        circlesPerRow={circlesPerRow}
        n={d.n}
        shift={shifts[i]}
      />
    );
  });

  return (
    <div className="dotChart">
      <div className="title">{title}</div>
      <svg className="dotChart" height={height} width={width}>
        <g className="circles">{circles}</g>
      </svg>
      <div className="publisher">{"Some publisher"}</div>
    </div>
  );
}

export default DotChart;
