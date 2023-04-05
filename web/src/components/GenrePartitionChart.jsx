import React from "react";
import "../assets/GenrePartitionChart.css";
import genreCounts from "../data/genre_counts";
import PartitionChart from "./PartitionChart";
import { formatGenre } from "../common/utils";
import _ from "lodash";

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

  return (
    <div className="genre">
      <svg className="genre" width="1200" height="600">
        <g transform="translate(0, 0)">
          <PartitionChart
            data={genres}
            width={600}
            barHeight={60}
            hue={30}
            saturation={89}
            maxLightness={55}
            minLightness={27.5}
            title="fiction"
          />
        </g>
        <g transform="translate(0,200)">
          <PartitionChart
            data={parsed.get("Fiction")}
            width={600}
            barHeight={60}
            hue={30}
            saturation={89}
            maxLightness={55}
            minLightness={27.5}
            title="fiction"
          />
        </g>
        <g transform="translate(0,400)">
          <PartitionChart
            data={parsed.get("Non Fiction")}
            width={600}
            barHeight={60}
            hue={30}
            saturation={89}
            maxLightness={55}
            minLightness={27.5}
            title="non-fiction"
          />
        </g>
      </svg>
    </div>
  );
}

export default GenrePartitionChart;
