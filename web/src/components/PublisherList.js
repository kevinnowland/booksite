import React, { useState } from 'react';
import '../assets/PublisherList.css';


function toPublisherLi(publisher) {
  return <li className="publisher" key={publisher}> {publisher} </li>
}

function PublisherList(props) {
  const [showExtras, setShowExtras]= useState(false);

  const initialPublishers = props.publishers.slice(0, 2);
  const initialList = initialPublishers.map(toPublisherLi);

  const endPublishers = props.publishers.slice(2);
  
  let displayStyle = {
    display: showExtras ? 'block' : 'none'
  }

  let antiDisplayStyle = {
    display: showExtras ? 'none' : 'block'
  }
  
  let endList;
  if (endPublishers.length > 0) {
    endList = (
      <div className="extraList">
        <li className="arrow down" style={antiDisplayStyle}>
          <div onMouseEnter={() => {setShowExtras(true)}}> ▼ </div>
        </li>
        <div style={displayStyle}>
          {endPublishers.map(toPublisherLi)}
        </div>
        <li className="arrow up" style={displayStyle}>
          <div onMouseEnter={() => {setShowExtras(false)}}> ▲ </div>
        </li>
      </div>
     )
  }

  return (
    <div className="publisherList">
      <ul className="publisherList">

        <div className="initialList">
          <li className="city"> {props.city} </li>
          {initialList}
        </div>

        {endList}

      </ul>
    </div>
  )
}

export default PublisherList;
