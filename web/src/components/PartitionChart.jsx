import React from "react";
import "../assets/PartitionChart.css";
import { scaleLinear } from "d3";

const mockData = [
  ["English", 10],
  ["French", 5],
  ["German", 3],
  ["Chinese", 1],
  ["Czech", 1],
  ["Russian", 1],
];

function getTotal(data) {
  return data.reduce((acc, d) => acc + d[1], 0);
}

function getMax(data) {
  return data.reduce((acc, d) => Math.max(acc, d[1]), 0);
}

function getMin(data) {
  return data.reduce((acc, d) => Math.min(acc, d[1]), 0);
}

function rescaleData(data, total) {
  const rawTotal = getTotal(data);
  var newData = data.map((d) => [d[0], total * (d[1] / rawTotal)]);
  const newTotal = getTotal(newData);
  const diff = total - newTotal;
  for (let i = 0; i < diff; i++) {
    let ind = i % newData.length;
    newData[ind][1] += 1;
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
      width = data[i][1] - 2;
    } else {
      width = data[i][1] - 1;
    }

    if (i !== 0) {
      sum += 2;
    }

    partitionData.push({
      label: data[i][0],
      width: width,
      x: sum,
      lightness: lightnessScale(data[i][1]),
    });
    sum += width;
  }

  return partitionData;
}

function Partition(props) {
  return (
    <rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      fill={`hsl(${props.hue}, ${props.saturation}%, ${props.lightness}%)`}
    />
  );
}

function PartitionChart() {
  const width = 800;
  const height = 75;

  const rescaled = rescaleData(mockData, width);
  const maxVal = getMax(rescaled);
  const minVal = getMin(rescaled);
  const lightnessScale = scaleLinear()
    .domain([minVal, maxVal])
    .range([27.5, 55]);
  const partitionData = getPartitionData(rescaled, lightnessScale);

  const partitions = partitionData.map((d) => {
    return (
      <Partition
        key={d.label}
        x={d.x}
        y={0}
        width={d.width}
        height={height}
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
        {partitions}
      </svg>
    </div>
  );
}

export default PartitionChart;
