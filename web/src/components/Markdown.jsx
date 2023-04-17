import React from "react";
import ReactMarkdown from "react-markdown";

import "../assets/Markdown.css";

function Markdown(props) {
  return (
    <div className="markdown">
      <ReactMarkdown>{props.markdown}</ReactMarkdown>
    </div>
  );
}

export default Markdown;
