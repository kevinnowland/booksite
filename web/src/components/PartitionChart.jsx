import React, { useState } from "react";
import "../assets/PartitionChart.css";
import { scaleLinear } from "d3";

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
// returns [[str, int, int],...] with new entry the
// rescaled version of the second entry
// TODO: use better data structure..
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

// requires this to be the rescaled data structure
function getLightnessScale(data, minLight, maxLight) {
  const maxVal = getMax(data, 2);
  const minVal = getMin(data, 2);
  return scaleLinear().domain([minVal, maxVal]).range([minLight, maxLight]);
}

// assumes data is sorted with max first
// data in format [[string, int], ... ]
export function getPartitionData(data, width, minLight, maxLight) {
  const rescaled = rescaleData(data, width);
  const lightnessScale = getLightnessScale(rescaled, minLight, maxLight);

  let partitionData = [];
  let sum = 0;
  for (let i = 0; i < rescaled.length; i++) {
    let width;
    if (i !== 0 && i !== rescaled.length) {
      width = rescaled[i][2] - 2;
    } else {
      width = rescaled[i][2] - 1;
    }

    if (i !== 0) {
      sum += 2;
    }

    partitionData.push({
      label: rescaled[i][0],
      value: rescaled[i][1],
      width: width,
      x: sum,
      lightness: lightnessScale(rescaled[i][2]),
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
      <text x="10" y={props.height + 50} opacity={opacity}>
        {props.label} - {props.value}
      </text>
    </g>
  );
}

function PartitionChart(props) {
  const data = props.data;
  const width = props.width;
  const barHeight = props.barHeight;
  const hue = props.hue;
  const saturation = props.saturation;
  const title = props.title;

  const partitions = data.map((d) => {
    return (
      <Partition
        key={d.label}
        label={d.label}
        value={d.value}
        x={d.x}
        y={30}
        width={d.width}
        height={barHeight}
        hue={hue}
        saturation={saturation}
        lightness={d.lightness}
      />
    );
  });

  return (
    <g className="partitionChart" width={width} height={barHeight + 50}>
      <text
        className="title"
        x={0.15 * width}
        y="20"
        fill="black"
        fontSize="20px"
      >
        {title}
      </text>
      {partitions}
    </g>
  );
}

export default PartitionChart;
