import React from "react";
import ReadingList from "./ReadingList";
import Map from "./Map";
import Introduction from "./Introduction";
import HorizontalBarChart from "./HorizontalBarChart";
import TriplePartitionChart from "./TriplePartitionChart";
import DotChart from "./DotChart";

import { parseGenreCounts, parseLanguageCounts } from "../common/utils";

import readingList from "../data/readingList";
import genreCounts from "../data/genreCounts";
import languageCounts from "../data/languageCounts";
import publisherCounts from "../data/publisherCounts";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readingList: readingList,
      introMarkdown: "",
    };
  }

  async componentDidMount() {
    const res = await fetch(process.env.PUBLIC_URL + "/introduction.md");
    const text = await res.text();
    this.setState({ introMarkdown: text });
  }

  render() {
    return (
      <div>
        <DotChart
          title={"Major vs Indie Publishers"}
          data={publisherCounts}
          width={300}
          circlesPerRow={10}
          colorShift={135}
          colorFrequency={87}
        />
        <TriplePartitionChart
          className="language"
          data={parseLanguageCounts(languageCounts)}
          keyOne="English"
          keyTwo="French"
          rootTitle="language read"
          keyOneTitle="english"
          keyTwoTitle="french"
          rootColor={{ hue: 30, saturation: 100, minLight: 5, maxLight: 22.5 }}
          keyOneColor={{
            hue: 240,
            saturation: 89,
            minLight: 27.5,
            maxLight: 55,
          }}
          keyTwoColor={{
            hue: 115,
            saturation: 89,
            minLight: 10,
            maxLight: 25,
          }}
        />
        <TriplePartitionChart
          className="genre"
          data={parseGenreCounts(genreCounts)}
          keyOne="Fiction"
          keyTwo="Non Fiction"
          rootTitle="genre"
          keyOneTitle="fiction"
          keyTwoTitle="non fiction"
          rootColor={{ hue: 30, saturation: 100, minLight: 5, maxLight: 22.5 }}
          keyOneColor={{
            hue: 240,
            saturation: 89,
            minLight: 27.5,
            maxLight: 55,
          }}
          keyTwoColor={{
            hue: 115,
            saturation: 89,
            minLight: 10,
            maxLight: 25,
          }}
        />
        <HorizontalBarChart />
        <Map />
        <ReadingList readingList={this.state.readingList} />
        <Introduction markdown={this.state.introMarkdown} />
        <div>
          {" "}
          <p> Shapefiles from census bureau data </p>{" "}
        </div>
      </div>
    );
  }
}

export default App;
