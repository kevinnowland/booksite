import React from 'react';
import ReadingList from './ReadingList'
import Map from './Map'

import reading_list from '../data/reading_list'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "readingList": reading_list,
    };
  }

  render() {
    return (
      <div>
        <Map />
        {/*<ReadingList readingList={this.state.readingList} />*/}
        <div> <p> Shapefiles from census bureau data </p> </div>
      </div>
    )
  }
}

export default App;
