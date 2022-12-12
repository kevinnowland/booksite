import React from 'react';
import PublisherList from './PublisherList'

import publishers from '../data/publishers'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "publishers": publishers,
    };
  }

  render() {
    return (
      <div>
      {Object.entries(this.state.publishers).map(([k, v]) => {
          return (
            <div key={k} style={{display: 'block'}}>
            <PublisherList key={k} city={k} publishers={v} />
            </div>
          );
      })}
      </div>
    )
  }
}

export default App;
