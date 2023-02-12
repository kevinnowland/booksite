import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
//import data from '../data/arizona'
import data from '../data/usa_states_small.json'
import '../assets/Map.css'


function Map(props) {
  const svgRef = useRef();
  const projRef= useRef(d3.geoAlbersUsa().scale(1500))

  const renderChart = (data, path) => {
    d3.select(svgRef.current)
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('class', (d) => d.properties.NAME)
      .attr('d', path)
      .style('fill', 'grey')
      .style('stroke-width', 1)
      .style('stroke', 'black')
  };

  useEffect(() => {
    const height = svgRef.current.clientHeight;
    const width = svgRef.current.clientWidth;

    projRef.current.translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projRef.current);

    renderChart(data.features, path)
  }, []);

  return (
    <div className='map'>
      <svg width='1200px' height='800px' className='map' ref={svgRef}></svg>
    </div>
  )
}

export default Map;
