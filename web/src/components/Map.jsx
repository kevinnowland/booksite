import React, { useState } from "react";
import * as d3 from "d3";
import cities from "../data/usa_cities.json";
import states from "../data/usa_states_small.json";
import publisherCities from "../data/publisher_cities_list.json";
import "../assets/Map.css";
import { getStateAbbrev } from "../common/utils";

function getCityIndex(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === obj.name && list[i].state === obj.state) {
      return i;
    }
  }
  return -1;
}

function getCitiesToRender() {
  const features = cities.features.reduce((filtered, feature) => {
    const ind = getCityIndex(feature.properties, publisherCities.cities);
    if (ind > -1) {
      const city = publisherCities.cities[ind];
      filtered.push({
        name: city.name,
        state: city.state,
        publishers: city.publishers,
        coordinates: feature.geometry.coordinates,
      });
    }
    return filtered;
  }, []);
  return {
    type: "FeatureCollection",
    features: features,
  };
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
        <i>{props.name}</i>: {titles}
      </div>
    </div>
  );
}

function CityCircle(props) {
  const [isHidden, setIsHidden] = useState(true);

  const handleMouseOver = () => setIsHidden(false);
  const handleMouseOut = () => setIsHidden(true);

  const i = getCityIndex(props, publisherCities.cities);
  const cityData = publisherCities.cities[i];
  const numPublishers = cityData.publishers.length;
  let numBooks = 0;
  for (let i = 0; i < numPublishers; i++) {
    numBooks += cityData.publishers[i].titles.length;
  }

  const publishers = cityData.publishers.map((p) => {
    return <Publisher key={p.name} name={p.name} titles={p.titles} />;
  });

  return (
    <g>
      <circle
        cx={props.cx}
        cy={props.cy}
        r="5"
        fill="orange"
        stroke="black"
        strokeWidth="1"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      ></circle>
      <foreignObject
        x={props.cx - 50}
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
            <b>
              {props.name}, {getStateAbbrev(props.state)}
            </b>
          </div>
          <div className="pubSummary">
            {numBooks} book/s read from {numPublishers} publisher/s located
            here.
          </div>
          <div className="publishers">{publishers}</div>
        </div>
      </foreignObject>
    </g>
  );
}

function Map() {
  const width = 1500;
  const height = 800;
  const projection = d3
    .geoAlbersUsa()
    .scale(1500)
    .translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);
  const citiesToRender = getCitiesToRender();
  console.log(citiesToRender);

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
    return citiesToRender.features.map((c) => {
      return (
        <CityCircle
          key={c.name + "-" + c.state}
          name={c.name}
          state={c.state}
          cx={projection(c.coordinates)[0]}
          cy={projection(c.coordinates)[1]}
        />
      );
    });
  };

  return (
    <div className="map">
      <svg height={height} width={width} className="map">
        <g className="UsaStates">{renderStates()}</g>
        <g className="UsaCities">{renderCities()}</g>
      </svg>
    </div>
  );
}

export default Map;
