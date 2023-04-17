import React from "react";
import ReadingList from "./ReadingList";
import Map from "./Map";
import Markdown from "./Markdown";
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
      markdown: {},
    };
  }

  async componentDidMount() {
    const files = [
      { key: "intro", file: "./introduction.md" },
      { key: "indie", file: "./publishers_indie.md" },
      { key: "geography", file: "./publishers_geography.md" },
      { key: "genre", file: "./genre.md" },
      { key: "language", file: "./language.md" },
      { key: "outro", file: "./outro.md" },
    ];

    for (let f of files) {
      let res = await fetch(process.env.PUBLIC_URL + f.file);
      let text = await res.text();
      this.setState((prevState) => ({
        markdown: {
          ...prevState.markdown,
          [f.key]: text,
        },
      }));
    }
  }

  render() {
    return (
      <div>
        <Markdown markdown={this.state.markdown.intro} />
        <DotChart
          title={"Major vs Indie Publishers"}
          data={publisherCounts}
          width={800}
          circlesPerRow={12}
          colorShift={135}
          colorFrequency={87}
        />
        <Markdown markdown={this.state.markdown.indie} />
        <Map />
        <Markdown markdown={this.state.markdown.geography} />
        <HorizontalBarChart />
        <Markdown markdown={this.state.markdown.genre} />
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
        <Markdown markdown={this.state.markdown.language} />
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
        <Markdown markdown={this.state.markdown.outro} />
        <ReadingList readingList={this.state.readingList} />
        <div>
          {" "}
          <p> Shapefiles from census bureau data </p>{" "}
        </div>
      </div>
    );
  }
}

export default App;
