import React from "react";
import "../assets/GenrePartitionChart.css";
import genreCounts from "../data/genre_counts";
import PartitionChart, { getPartitionData } from "./PartitionChart";
import { formatGenre } from "../common/utils";

function compareCounts(a, b) {
  const diff = b[1] - a[1];
  if (diff !== 0) {
    return diff;
  } else {
    return b[0].localeCompare(a[0]);
  }
}

function parseGenreData(genreData) {
  var counts = new Map();

  for (let g of genreData.genres) {
    let genreKey = formatGenre(g.genre);
    counts.set(
      genreKey,
      g.subgenres
        .map((sg) => [formatGenre(sg.subgenre), sg.count])
        .sort(compareCounts)
    );
  }

  return counts;
}

function aggregateCounts(genreData) {
  var counts = [];
  for (let [genre, subgenres] of genreData) {
    let count = subgenres.reduce((acc, sg) => acc + sg[1], 0);
    counts.push([genre, count]);
  }
  return counts.sort(compareCounts);
}

function GenrePartitionChart() {
  const parsed = parseGenreData(genreCounts);
  const genres = aggregateCounts(parsed);
  const height = 300;
  const width = 900;
  const genreBarHeight = 45;
  const genreBarWidth = 400;
  const subgenreBarHeight = 45;
  const subgenreBarWidth = 400;

  const genrePartitionData = getPartitionData(genres, genreBarWidth, 5, 22.5);
  const fictionPartitionData = getPartitionData(
    parsed.get("Fiction"),
    subgenreBarWidth,
    27.5,
    55
  );
  const nonfictionPartitionData = getPartitionData(
    parsed.get("Non Fiction"),
    subgenreBarWidth,
    10,
    25
  );

  // get x and y coordinates needed for lines
  const genreLeftX = (width - genreBarWidth) / 2;
  const subgenreTranslateY = height - 100;
  const subgenreTranslateX = width - subgenreBarWidth;

  const partitionY = 30;
  const genreBarBottomY = partitionY + genreBarHeight;

  const subgenreBarTopY = partitionY + subgenreTranslateY;

  // genre points
  const genreFictionBottomLeft = { x: genreLeftX, y: genreBarBottomY };
  const genreFictionBottomRight = {
    x: genreLeftX + genrePartitionData[0].width,
    y: genreBarBottomY,
  };
  const genreNonfictionBottomLeft = {
    x: genreLeftX + genrePartitionData[1].x,
    y: genreBarBottomY,
  };
  const genreNonfictionBottomRight = {
    x: genreLeftX + genrePartitionData[1].x + genrePartitionData[1].width,
    y: genreBarBottomY,
  };

  // subgenre points
  const fictionTopLeft = {
    x: 0,
    y: subgenreBarTopY,
  };
  const fictionTopRight = {
    x: subgenreBarWidth,
    y: subgenreBarTopY,
  };

  const nonfictionTopLeft = {
    x: subgenreTranslateX,
    y: subgenreBarTopY,
  };
  const nonfictionTopRight = {
    x: subgenreTranslateX + subgenreBarWidth,
    y: subgenreBarTopY,
  };

  const lines = (
    <g>
      <path
        d={`M${genreFictionBottomLeft.x} ${genreFictionBottomLeft.y} L${fictionTopLeft.x} ${fictionTopLeft.y}`}
        stroke="lightgrey"
        strokeWidth="1"
      />
      <path
        d={`M${genreFictionBottomRight.x} ${genreFictionBottomRight.y} L${fictionTopRight.x} ${fictionTopRight.y}`}
        stroke="lightgrey"
        strokeWidth="1"
      />
      <path
        d={`M${genreNonfictionBottomLeft.x} ${genreNonfictionBottomLeft.y} L${nonfictionTopLeft.x} ${nonfictionTopLeft.y}`}
        stroke="lightgrey"
        strokeWidth="1"
      />
      <path
        d={`M${genreNonfictionBottomRight.x} ${genreNonfictionBottomRight.y} L${nonfictionTopRight.x} ${nonfictionTopRight.y}`}
        stroke="lightgrey"
        strokeWidth="1"
      />
    </g>
  );

  return (
    <div className="genre">
      <svg className="genre" width={width} height={height}>
        <g transform={`translate(${genreLeftX}, 0)`}>
          <PartitionChart
            data={genrePartitionData}
            width={genreBarWidth}
            barHeight={genreBarHeight}
            hue={30}
            saturation={100}
            title="genre"
          />
        </g>
        <g transform={`translate(0,${subgenreTranslateY})`}>
          <PartitionChart
            data={fictionPartitionData}
            width={subgenreBarWidth}
            barHeight={subgenreBarHeight}
            hue={240}
            saturation={89}
            title="fiction"
          />
        </g>
        <g transform={`translate(${subgenreTranslateX},${subgenreTranslateY})`}>
          <PartitionChart
            data={nonfictionPartitionData}
            width={subgenreBarWidth}
            barHeight={subgenreBarHeight}
            hue={115}
            saturation={89}
            title="non-fiction"
          />
        </g>
        {lines}
      </svg>
    </div>
  );
}

export default GenrePartitionChart;
