import React from 'react';
import ReactMarkdown from 'react-markdown';

import '../assets/Introduction.css'

function Introduction(props) {
  return (
    <ReactMarkdown>{props.markdown}</ReactMarkdown>
  )
}

export default Introduction;
