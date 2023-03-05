import React from 'react';
import * as d3 from 'd3';
//import data from '../data/arizona'
import data from '../data/usa_states_small.json'
import '../assets/Map.css'


function Map(props) {
  const width = 1200;
  const height = 800;
  const projection = d3.geoAlbersUsa().scale(1500).translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);

  const renderPaths = () => {
    return data.features.map((d) => {
      return (
        <path
          key={d.properties.NAME}
          d={path(d)}
          className={d.properties.NAME}
          fill='lightgrey'
          strokeWidth='1'
          stroke='black'
        />
      )
    })
  };

  return (
    <div className='map'>
      <svg height={height} width={width} className='map'>{renderPaths()}</svg>
    </div>
  )
}

export default Map;
