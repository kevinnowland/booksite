import React from 'react';
import PublisherList from './PublisherList'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "publishers": {
        "New York": [
          "Akashic Books",
          "Bellevue Literary Press",
          "Catapult Books",
          "Europa Editions",
          "The Feminist Press",
          "New Directions Publishing",
          "Sevent Stories Press",
          "Ugly Duckling Presse",
        ],
      },
    };
  }

  render() {
    return (
      <PublisherList 
        city={Object.keys(this.state.publishers)[0]}
        publishers={this.state.publishers[Object.keys(this.state.publishers)[0]]}
      />
    )
  }
}

export default App;
