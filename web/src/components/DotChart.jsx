import React, { useState } from "react";
import "../assets/DotChart.css";
import { mulberry32 } from "../common/utils";

function CircleSequence(props) {
  // props
  const count = props.count;
  const shift = props.shift;
  const circlesPerRow = props.circlesPerRow;
  const r = props.r;
  const fill = props.fill;
  const hoverFill = props.hoverFill;

  // state
  const [isHover, setIsHover] = useState(false);

  const handleMouseOver = () => {
    setIsHover(true);
  };
  const handleMouseOut = () => {
    setIsHover(false);
  };

  let coords = [];
  for (let i = shift; i < count + shift; i++) {
    let row = Math.floor(i / circlesPerRow);
    let col = i % circlesPerRow;
    coords.push({
      cx: r * (2 * col + 1),
      cy: r * (2 * row + 1),
    });
  }

  const circles = coords.map((d, i) => {
    return (
      <circle
        key={i}
        cx={d.cx}
        cy={d.cy}
        r={r}
        fill={isHover ? hoverFill : fill}
      />
    );
  });

  return (
    <g
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="circleSequence"
    >
      {circles}
    </g>
  );
}

function DotChart(props) {
  // props
  const width = props.width;
  const data = props.data;
  const title = props.title;
  const circlesPerRow = props.circlesPerRow;
  const seed = props.seed !== undefined ? props.seed : 47;

  // state
  const [publisher, setPublisher] = useState(<span>&nbsp;</span>);

  // calculated
  const radius = width / (2 * circlesPerRow);
  const nCircles = data.publishers.reduce((acc, d) => acc + d.count, 0);
  const nRows = Math.floor(nCircles / circlesPerRow) + 1;
  const height = 2 * radius * nRows;
  const prng = mulberry32(seed);

  // handlers
  const handleMouseOver = (p, n) => {
    setPublisher(`${p} - ${n}`);
  };
  const handleMouseOut = () => {
    setPublisher(<span>&nbsp;</span>);
  };

  let shifts = [0];
  for (let i = 0; i < data.publishers.length - 1; i++) {
    shifts.push(shifts[i] + data.publishers[i].count);
  }
  const circles = data.publishers.map((d, i) => {
    let fill;
    let hoverFill;
    if (!d.isIndependent) {
      fill = `hsl(0, 0%, 50%)`;
      hoverFill = `hsl(0, 0%, 60%)`;
    } else {
      let c = Math.floor(prng() * 360);
      fill = `hsl(${c}, 70%, 50%)`;
      hoverFill = `hsl(${c}, 70%, 60%)`;
    }
    return (
      <g
        key={i}
        onMouseOver={() => handleMouseOver(d.name, d.count)}
        onMouseOut={handleMouseOut}
      >
        <CircleSequence
          r={radius}
          circlesPerRow={circlesPerRow}
          count={d.count}
          shift={shifts[i]}
          fill={fill}
          hoverFill={hoverFill}
        />
      </g>
    );
  });

  return (
    <div className="dotChart">
      <div className="title">{title}</div>
      <svg className="dotChart" height={height} width={width}>
        <g className="circles">{circles}</g>
      </svg>
      <div className="publisher">{publisher}</div>
    </div>
  );
}

export default DotChart;
