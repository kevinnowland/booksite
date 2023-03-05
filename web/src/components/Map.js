import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import cities from '../data/usa_cities.json'
import states from '../data/usa_states_small.json'
import '../assets/Map.css'


const publisherCities = [
  {"name": "New York City", "state": "New York"},
  {"name": "Columbus", "state": "Ohio"},
];

function objectInList(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (_.isEqual(obj, list[i])) {
      return true
    }
  }
  return false
}

function getCitiesToRender() {
  const features = cities.features.filter(f => objectInList(f.properties, publisherCities))
  return {
    "type": "FeatureCollection",
    "features": features
  }
}


function Map(props) {
  const width = 1200;
  const height = 800;
  const projection = d3.geoAlbersUsa().scale(1500).translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);
  const citiesToRender = getCitiesToRender();

  const renderStates = () => {
    return states.features.map((d) => {
      return (
        <path
          key={d.properties.NAME}
          d={path(d)}
          className={d.properties.NAME}
          fill='#F0F0F0'
          strokeWidth='1'
          stroke='black'
        />
      )
    })
  };

  const renderCities = () => {
    return citiesToRender.features.map((d) => {
      return (
        <circle
          key={d.properties.name + "-" + d.properties.state}
          cx={projection(d.geometry.coordinates)[0]}
          cy={projection(d.geometry.coordinates)[1]}
          r='5'
          fill="orange"
          stroke='black'
          strokeWidth='1'
        />
      )
    })
  };

  return (
    <div className='map'>
      <svg height={height} width={width} className='map'>
        <g className="UsaStates">{renderStates()}</g>
        <g className="UsaCities">{renderCities()}</g>
      </svg>
    </div>
  )
}

export default Map;
