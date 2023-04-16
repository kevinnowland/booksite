import React, { useState } from "react";
import "../assets/DotChart.css";
import { getColor } from "../common/colors";

// should be sorted non-indie first then indie
// then sorted big n to small n
const sampleData = {
  publishers: [
    {
      name: "one",
      n: 5,
      isIndependent: false,
    },
    {
      name: "two",
      n: 2,
      isIndependent: true,
    },
    {
      name: "three",
      n: 1,
      isIndependent: true,
    },
    {
      name: "four",
      n: 1,
      isIndependent: true,
    },
    {
      name: "five",
      n: 1,
      isIndependent: true,
    },
    {
      name: "size",
      n: 1,
      isIndependent: true,
    },
  ],
};

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

class DotChart extends React.Component {
  render() {
    const height = 300;
    const width = 300;
    const data = sampleData;

    const circlesPerRow = 5;
    const radius = width / (2 * circlesPerRow);

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
        <svg className="dotChart" height={height} width={width}>
          <g className="circles">{circles}</g>
        </svg>
      </div>
    );
  }
}

export default DotChart;
