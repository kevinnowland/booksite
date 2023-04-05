import React from "react";
import "../assets/GenrePartitionChart.css";
import genreCounts from "../data/genre_counts";
import PartitionChart from "./PartitionChart";
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
  const width = 1000;
  const barHeight = 45;
  const barWidth = 400;

  return (
    <div className="genre">
      <svg className="genre" width={width} height={height}>
        <g transform={`translate(${width / 2 - barWidth / 2}, 0)`}>
          <PartitionChart
            data={genres}
            width={barWidth}
            barHeight={barHeight}
            hue={30}
            saturation={89}
            maxLightness={55}
            minLightness={27.5}
            title="genre"
          />
        </g>
        <g transform={`translate(0,${height - 100})`}>
          <PartitionChart
            data={parsed.get("Fiction")}
            width={barWidth}
            barHeight={barHeight}
            hue={240}
            saturation={89}
            maxLightness={55}
            minLightness={27.5}
            title="fiction"
          />
        </g>
        <g transform={`translate(${width - barWidth},${height - 100})`}>
          <PartitionChart
            data={parsed.get("Non Fiction")}
            width={barWidth}
            barHeight={barHeight}
            hue={115}
            saturation={89}
            maxLightness={25}
            minLightness={10}
            title="non-fiction"
          />
        </g>
      </svg>
    </div>
  );
}

export default GenrePartitionChart;
