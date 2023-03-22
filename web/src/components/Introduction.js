import React from 'react';
import ReactMarkdown from 'react-markdown';

import '../assets/Introduction.css'

function Introduction(props) {
  return (
    <div className='introduction'>
      <ReactMarkdown>{props.markdown}</ReactMarkdown>
    </div>
  )
}

export default Introduction;
