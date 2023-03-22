import React from 'react';
import ReadingList from './ReadingList'
import Map from './Map'
import Introduction from './Introduction'

import reading_list from '../data/reading_list'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "readingList": reading_list,
      'introMarkdown': '',
    };
  }

  async componentDidMount() {
    const res = await fetch(process.env.PUBLIC_URL + '/introduction.md')
    const text = await res.text()
    this.setState({ introMarkdown: text })
  }

  render() {

    return (
      <div>
        <Introduction markdown={this.state.introMarkdown} />
        <Map />
        <ReadingList readingList={this.state.readingList} />
        <div> <p> Shapefiles from census bureau data </p> </div>
      </div>
    )
  }
}

export default App;
