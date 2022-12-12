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
        "Columbus": [
          "Two Dollar Radio",
        ],
      },
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
