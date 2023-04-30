import React from "react";
import ReadingList from "./ReadingList";
import Map from "./Map";
import Markdown from "./Markdown";
import HorizontalBarChart from "./HorizontalBarChart";
import TriplePartitionChart from "./TriplePartitionChart";
import DotChart from "./DotChart";

import {
  parseGenreCounts,
  parseLanguageCounts,
  widthInPixels,
} from "../common/utils";

import readingList from "../data/readingList";
import genreCounts from "../data/genreCounts";
import languageCounts from "../data/languageCounts";
import publisherCounts from "../data/publisherCounts";

import "../assets/App.css";

function Button(props) {
  const text = props.text;
  const isClicked = props.isClicked;
  const onClick = props.onClick;

  let style;
  if (isClicked) {
    style = { textDecoration: "underline" };
  } else {
    style = { textDecoration: "none" };
  }

  return (
    <div className="button" onClick={onClick} style={style}>
      {text}
    </div>
  );
}

function Nav(props) {
  const showList = props.showList;
  const updateShowList = props.updateShowList;

  return (
    <div className="nav">
      <div className="buttons">
        <Button
          onClick={(e) => updateShowList(e, false)}
          isClicked={!showList}
          text="text"
        />
        <div className="separator"> · </div>
        <Button
          onClick={(e) => updateShowList(e, true)}
          isClicked={showList}
          text="reading list"
        />
      </div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      markdown: {},
    };

    this.updateShowList = this.updateShowList.bind(this);
  }

  updateShowList(_, val) {
    this.setState({
      showList: val,
    });
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
    const isMobile = widthInPixels(100) < 500;

    return (
      <div className="app">
        <Nav
          updateShowList={this.updateShowList}
          showList={this.state.showList}
        />
        <div
          className="main"
          style={{ display: this.state.showList ? "none" : "block" }}
        >
          <Markdown markdown={this.state.markdown.intro} />
          <DotChart
            title={"Major vs Indie Publishers"}
            data={publisherCounts}
            width={isMobile ? widthInPixels(80) : widthInPixels(55)}
            circlesPerRow={12}
            colorShift={135}
            colorFrequency={87}
          />
          <Markdown markdown={this.state.markdown.indie} />
          <Map
            showCityInfo={!isMobile}
            width={isMobile ? widthInPixels(80) : widthInPixels(70)}
          />
          <Markdown markdown={this.state.markdown.geography} />
          <HorizontalBarChart
            width={isMobile ? widthInPixels(80) : widthInPixels(45)}
          />
          <Markdown markdown={this.state.markdown.genre} />
          <TriplePartitionChart
            className="genre"
            width={isMobile ? widthInPixels(80) : widthInPixels(55)}
            incolumn={isMobile}
            data={parseGenreCounts(genreCounts)}
            keyOne="Fiction"
            keyTwo="Non Fiction"
            rootTitle="genre"
            keyOneTitle="fiction"
            keyTwoTitle="non fiction"
            rootColor={{
              hue: 30,
              saturation: 100,
              minLight: 5,
              maxLight: 22.5,
            }}
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
            width={isMobile ? widthInPixels(80) : widthInPixels(55)}
            incolumn={isMobile}
            data={parseLanguageCounts(languageCounts)}
            keyOne="English"
            keyTwo="French"
            rootTitle="language read"
            keyOneTitle="english"
            keyTwoTitle="french"
            rootColor={{
              hue: 30,
              saturation: 100,
              minLight: 5,
              maxLight: 22.5,
            }}
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
          <div className="disclaimer">
            {" "}
            <p> Shapefiles from census bureau data </p>{" "}
          </div>
        </div>
        <div style={{ display: this.state.showList ? "block" : "none" }}>
          <ReadingList readingList={readingList} incolumn={isMobile} />
        </div>
      </div>
    );
  }
}

export default App;
