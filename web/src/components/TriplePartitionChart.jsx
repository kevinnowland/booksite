import React from "react";
import "../assets/TriplePartitionChart.css";
import PartitionChart, { getPartitionData } from "./PartitionChart";
import { aggregateCounts } from "../common/utils";

function TriplePartitionChart(props) {
  const width = props.width;
  const data = props.data;
  const keyOne = props.keyOne;
  const keyTwo = props.keyTwo;
  const rootTitle = props.rootTitle;
  const keyOneTitle = props.keyOneTitle;
  const keyTwoTitle = props.keyTwoTitle;
  const rootColor = props.rootColor;
  const keyOneColor = props.keyOneColor;
  const keyTwoColor = props.keyTwoColor;

  const aggs = aggregateCounts(data);
  const height = width / 3;
  const rootBarHeight = 45;
  const rootBarWidth = width * 0.4;
  const childBarHeight = 45;
  const childBarWidth = width * 0.4;

  const rootPartitionData = getPartitionData(
    aggs,
    rootBarWidth,
    rootColor.minLight,
    rootColor.maxLight
  );
  const keyOnePartitionData = getPartitionData(
    data.get(keyOne),
    childBarWidth,
    keyOneColor.minLight,
    keyOneColor.maxLight
  );
  const keyTwoPartitionData = getPartitionData(
    data.get(keyTwo),
    childBarWidth,
    keyTwoColor.minLight,
    keyTwoColor.maxLight
  );

  // get x and y coordinates needed for lines
  const rootLeftX = (width - rootBarWidth) / 2;
  const childTranslateY = height - 100;
  const childTranslateX = width - childBarWidth;

  const partitionY = 30;
  const rootBarBottomY = partitionY + rootBarHeight;

  const childBarTopY = partitionY + childTranslateY;

  // root points
  const rootKeyOneBottomLeft = { x: rootLeftX, y: rootBarBottomY };
  const rootKeyOneBottomRight = {
    x: rootLeftX + rootPartitionData[0].width,
    y: rootBarBottomY,
  };
  const rootKeyTwoBottomLeft = {
    x: rootLeftX + rootPartitionData[1].x,
    y: rootBarBottomY,
  };
  const rootKeyTwoBottomRight = {
    x: rootLeftX + rootPartitionData[1].x + rootPartitionData[1].width,
    y: rootBarBottomY,
  };

  // child points
  const keyOneTopLeft = {
    x: 0,
    y: childBarTopY,
  };
  const keyOneTopRight = {
    x: childBarWidth,
    y: childBarTopY,
  };

  const keyTwoTopLeft = {
    x: childTranslateX,
    y: childBarTopY,
  };
  const keyTwoTopRight = {
    x: childTranslateX + childBarWidth,
    y: childBarTopY,
  };

  const lines = (
    <g>
      <path
        d={`M${rootKeyOneBottomLeft.x} ${rootKeyOneBottomLeft.y} L${keyOneTopLeft.x} ${keyOneTopLeft.y}`}
        stroke="lightgrey"
        strokeWidth="1"
      />
      <path
        d={`M${rootKeyOneBottomRight.x} ${rootKeyOneBottomRight.y} L${keyOneTopRight.x} ${keyOneTopRight.y}`}
        stroke="lightgrey"
        strokeWidth="1"
      />
      <path
        d={`M${rootKeyTwoBottomLeft.x} ${rootKeyTwoBottomLeft.y} L${keyTwoTopLeft.x} ${keyTwoTopLeft.y}`}
        stroke="lightgrey"
        strokeWidth="1"
      />
      <path
        d={`M${rootKeyTwoBottomRight.x} ${rootKeyTwoBottomRight.y} L${keyTwoTopRight.x} ${keyTwoTopRight.y}`}
        stroke="lightgrey"
        strokeWidth="1"
      />
    </g>
  );

  return (
    <div className="triplePartitionChart">
      <svg className="triplePartitionChart" width={width} height={height}>
        <g transform={`translate(${rootLeftX}, 0)`}>
          <PartitionChart
            className="root"
            data={rootPartitionData}
            width={rootBarWidth}
            barHeight={rootBarHeight}
            hue={rootColor.hue}
            saturation={rootColor.saturation}
            title={rootTitle}
          />
        </g>
        <g transform={`translate(0,${childTranslateY})`}>
          <PartitionChart
            className="keyOne"
            data={keyOnePartitionData}
            width={childBarWidth}
            barHeight={childBarHeight}
            hue={keyOneColor.hue}
            saturation={keyOneColor.saturation}
            title={keyOneTitle}
          />
        </g>
        <g transform={`translate(${childTranslateX},${childTranslateY})`}>
          <PartitionChart
            className="keyTwo"
            data={keyTwoPartitionData}
            width={childBarWidth}
            barHeight={childBarHeight}
            hue={keyTwoColor.hue}
            saturation={keyTwoColor.saturation}
            title={keyTwoTitle}
          />
        </g>
        {lines}
      </svg>
    </div>
  );
}

export default TriplePartitionChart;
