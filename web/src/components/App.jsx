import React from "react";
import ReadingList from "./ReadingList";
import Map from "./Map";
import Introduction from "./Introduction";
import HorizontalBarChart from "./HorizontalBarChart";
import TriplePartitionChart from "./TriplePartitionChart";

import { parseGenreCounts, parseLanguageCounts } from "../common/utils";

import reading_list from "../data/reading_list";
import genreCounts from "../data/genre_counts";
import languageCounts from "../data/language_counts";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readingList: reading_list,
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
        <TriplePartitionChart
          className="language"
          data={parseLanguageCounts(languageCounts)}
          keyOne="English"
          keyTwo="French"
          rootTitle="language read"
          keyOneTitle="english"
          keyTwoTitle="french"
        />
        <TriplePartitionChart
          className="genre"
          data={parseGenreCounts(genreCounts)}
          keyOne="Fiction"
          keyTwo="Non Fiction"
          rootTitle="genre"
          keyOneTitle="fiction"
          keyTwoTitle="non fiction"
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
