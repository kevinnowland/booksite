import React, { useState, useCallback } from "react";
import "../assets/PartitionChart.css";
import { scaleLinear } from "d3";
import _ from "lodash";

const mockData = [
  ["English", 10],
  ["French", 5],
  ["German", 3],
  ["Chinese", 1],
  ["Czech", 1],
  ["Russian", 1],
];

function getTotal(data, index) {
  return data.reduce((acc, d) => acc + d[index], 0);
}

function getMax(data, index) {
  return data.reduce((acc, d) => Math.max(acc, d[index]), 0);
}

function getMin(data, index) {
  return data.reduce((acc, d) => Math.min(acc, d[index]), 0);
}

// data must have format [[str, int],...]
function rescaleData(data, total) {
  const rawTotal = getTotal(data, 1);
  var newData = data.map((d) => [d[0], d[1], total * (d[1] / rawTotal)]);
  const newTotal = getTotal(newData);
  const diff = total - newTotal;
  for (let i = 0; i < diff; i++) {
    let ind = i % newData.length;
    newData[ind][2] += 1;
  }
  return newData;
}

// assumes data is sorted with max first
function getPartitionData(data, lightnessScale) {
  let partitionData = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    let width;
    if (i !== 0 && i !== data.length) {
      width = data[i][2] - 2;
    } else {
      width = data[i][2] - 1;
    }

    if (i !== 0) {
      sum += 2;
    }

    partitionData.push({
      label: data[i][0],
      value: data[i][1],
      width: width,
      x: sum,
      lightness: lightnessScale(data[i][2]),
    });
    sum += width;
  }

  return partitionData;
}

function Partition(props) {
  const [lightness, setLightness] = useState(props.lightness);
  const [opacity, setOpacity] = useState(0);

  const handleMouseOver = () => {
    setLightness(Math.min(props.lightness + 7, 100));
    setOpacity(1);
  };
  const handleMouseOut = () => {
    setLightness(props.lightness);
    setOpacity(0);
  };

  return (
    <g>
      <rect
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        fill={`hsl(${props.hue}, ${props.saturation}%, ${lightness}%)`}
      />
      <text x="10" y="120" opacity={opacity}>
        {props.label} - {props.value}
      </text>
    </g>
  );
}

function PartitionChart() {
  const width = 800;
  const height = 140;

  const rescaled = rescaleData(mockData, width);
  const maxVal = getMax(rescaled, 2);
  const minVal = getMin(rescaled, 2);
  const lightnessScale = scaleLinear()
    .domain([minVal, maxVal])
    .range([27.5, 55]);
  const partitionData = getPartitionData(rescaled, lightnessScale);

  const partitions = partitionData.map((d) => {
    return (
      <Partition
        key={d.label}
        label={d.label}
        value={d.value}
        x={d.x}
        y={30}
        width={d.width}
        height={75}
        hue={30}
        saturation={89}
        lightness={d.lightness}
      />
    );
  });

  // TODO: change to g and remove svg
  return (
    <div className="partitionChart">
      <svg className="partitionChart" width={width} height={height}>
        <text className="title" x="10" y="20" fill="black" fontSize="20px">
          Books read by original language
        </text>
        {partitions}
      </svg>
    </div>
  );
}

export default PartitionChart;
