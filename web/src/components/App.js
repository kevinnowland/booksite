import React from 'react';
import PublisherList from './PublisherList'
import ReadingList from './ReadingList'

import publishers from '../data/publishers'
import reading_list from '../data/reading_list'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "publishers": publishers,
      "readingList": reading_list,
    };
  }

  render() {
    return (
      <div>
        <div>
          {Object.entries(this.state.publishers).map(([k, v]) => {
              return (
                <div key={k} style={{display: 'block'}}>
                <PublisherList key={k} city={k} publishers={v} />
                </div>
              );
          })}
        </div>

        <ReadingList readingList={this.state.readingList} />

        <div> <p> Shapefiles from census bureau data </p> </div>
      </div>
    )
  }
}

export default App;
