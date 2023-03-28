import React, { useState } from "react";
import * as d3 from "d3";
import cities from "../data/usa_cities.json";
import states from "../data/usa_states_small.json";
import publisherCities from "../data/publisher_cities_list.json";
import "../assets/Map.css";
import { getStateAbbrev } from "../common/utils";

function cityInList(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === obj.name && list[i].state === obj.state) {
      return true;
    }
  }
  return false;
}

function getCitiesToRender() {
  const features = cities.features.filter((f) =>
    cityInList(f.properties, publisherCities.cities)
  );
  return {
    type: "FeatureCollection",
    features: features,
  };
}

function CityCircle(props) {
  const fireAlert = () => {
    alert("foo");
  };

  return (
    <g>
      <circle
        cx={props.cx}
        cy={props.cy}
        r="5"
        fill="orange"
        stroke="black"
        strokeWidth="1"
        onMouseEnter={fireAlert}
      >
        <title>
          {" "}
          {props.name}, {props.state}{" "}
        </title>
      </circle>
      <foreignObject x={props.cx} y={props.cy} height="200" width="100">
        <div xmlns="http://www.w3.org/1999/xhtml">
          {props.name}, {getStateAbbrev(props.state)}
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
    return citiesToRender.features.map((d) => {
      return (
        <CityCircle
          key={d.properties.name + "-" + d.properties.state}
          name={d.properties.name}
          state={d.properties.state}
          cx={projection(d.geometry.coordinates)[0]}
          cy={projection(d.geometry.coordinates)[1]}
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
