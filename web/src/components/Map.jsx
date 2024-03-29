import React, { useState } from "react";
import * as d3 from "d3";
import cities from "../data/usaCities.json";
import states from "../data/usaStatesSmall.json";
import publisherCities from "../data/publisherCities.json";
import "../assets/Map.css";
import { getCityStateAbbrev } from "../common/utils";

function getCityIndex(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === obj.name && list[i].state === obj.state) {
      return i;
    }
  }
  return -1;
}

function getCitiesToRender(projection) {
  const citiesToRender = cities.features.reduce((filtered, feature) => {
    const ind = getCityIndex(feature.properties, publisherCities.cities);
    if (ind > -1) {
      const city = publisherCities.cities[ind];
      const coords = projection(feature.geometry.coordinates);
      filtered.push({
        name: city.name,
        state: city.state,
        publishers: city.publishers,
        cx: coords[0],
        cy: coords[1],
      });
    }
    return filtered;
  }, []);
  return citiesToRender;
}

function Publisher(props) {
  const numBooks = props.titles.length;
  let titles = "";
  for (let i = 0; i < numBooks; i++) {
    if (i < numBooks - 1) {
      titles += props.titles[i] + "; ";
    } else {
      titles += props.titles[i];
    }
  }

  return (
    <div className="publisher">
      <div className="publisherName">
        <u>{props.name}</u>: {titles}
      </div>
    </div>
  );
}

function CityInfo(props) {
  const publishers = props.publishers;

  const [isHidden, setIsHidden] = useState(true);

  const handleMouseOver = () => setIsHidden(false);
  const handleMouseOut = () => setIsHidden(true);

  const numPublishers = publishers.length;
  let numBooks = 0;
  for (let i = 0; i < numPublishers; i++) {
    numBooks += publishers[i].titles.length;
  }

  const cityPublishers = publishers.map((p) => {
    return <Publisher key={p.name} name={p.name} titles={p.titles} />;
  });

  return (
    <g>
      <rect
        x={props.cx - 5}
        y={props.cy - 5}
        width="10"
        height="10"
        opacity="0"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      ></rect>
      <foreignObject
        x={props.cx - 125}
        y={props.cy - 50}
        height="100%"
        width="100%"
        style={{ visibility: isHidden ? "hidden" : "visible" }}
      >
        <div
          className="pubCityInfo"
          xmlns="http://www.w3.org/1999/xhtml"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <div>
            <b>{getCityStateAbbrev(props.name, props.state)}</b>
          </div>
          <div className="pubSummary">
            {numBooks} book/s read from {numPublishers} publisher/s located
            here.
          </div>
          <div className="publishers">{cityPublishers}</div>
        </div>
      </foreignObject>
    </g>
  );
}

function CityCircle(props) {
  return (
    <circle
      cx={props.cx}
      cy={props.cy}
      r="5"
      fill="orange"
      stroke="black"
      strokeWidth="1"
    ></circle>
  );
}

function Map(props) {
  const width = props.width;
  const showCityInfo = props.showCityInfo;

  const height = width * 0.55;
  const projection = d3
    .geoAlbersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);
  const citiesToRender = getCitiesToRender(projection);

  const renderStates = () => {
    return states.features.map((d) => {
      return (
        <path
          key={d.properties.NAME}
          d={path(d)}
          className={d.properties.NAME}
          fill="#F0F0F0"
          strokeWidth="1"
          stroke="black"
        />
      );
    });
  };

  const renderCities = () => {
    return citiesToRender.map((c) => {
      return (
        <CityCircle
          key={c.name + "-" + c.state}
          name={c.name}
          state={c.state}
          cx={c.cx}
          cy={c.cy}
        />
      );
    });
  };

  const renderCityInfo = () => {
    return citiesToRender.map((c) => {
      return (
        <CityInfo
          key={c.name + "-" + c.state}
          name={c.name}
          state={c.state}
          publishers={c.publishers}
          cx={c.cx}
          cy={c.cy}
        />
      );
    });
  };

  return (
    <div className="map">
      <svg height={height} width={width} className="map">
        <g className="UsaStates">{renderStates()}</g>
        <g className="UsaCities">{renderCities()}</g>
        <g className="usaCityInfo">{showCityInfo ? renderCityInfo() : null}</g>
      </svg>
    </div>
  );
}

export default Map;
