import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';


class Box extends React.Component {
  render() {
    return (
      <div className="box">
        <p>Hello, world!</p>
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Box />);
