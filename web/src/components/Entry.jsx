import React from "react";
import "../assets/Entry.css";
import { getStateAbbrev } from "../common/utils";

function getAuthors(authors) {
  var author_list = "";
  authors.forEach((author, i) => {
    if (i > 0) {
      author_list += ", ";
    }
    author_list += author.name;
  });
  return author_list;
}

function BookHeader(props) {
  const book = props.book;
  const incolumn = props.incolumn;

  const style = {
    width: incolumn ? `100%` : `79%`,
    textAlign: incolumn ? `center` : `left`,
    paddingBottom: incolumn ? `10px` : null,
  };

  return (
    <div className="bookHeader" style={style}>
      <div className="title">{book.title}</div>
      <div className="authors">{getAuthors(book.authors)}</div>
    </div>
  );
}

export function starRating(rating) {
  var stars = "";
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars += "\u2605";
    } else {
      stars += "\u2606";
    }
  }
  return stars;
}

function dateText(date_string) {
  const d = new Date(date_string.replace(/-/g, "/"));
  const options = { day: "numeric", month: "short", year: "numeric" };
  const dateString = d.toLocaleDateString("en-US", options);
  return dateString;
}

function RatingHeader(props) {
  const incolumn = props.incolumn;
  const rating = props.entry.rating;

  const stoppedReadingDate = props.entry.stoppedReadingDate;
  return (
    <div className="ratingHeader" style={{ width: incolumn ? `100%` : `20%` }}>
      <div className="rating">{starRating(rating)}</div>
      <div className="stoppedReadingDate">{dateText(stoppedReadingDate)}</div>
    </div>
  );
}

function getIsIndependentText(isIndependent) {
  if (isIndependent) {
    return "";
  } else {
    return "not";
  }
}

function getCity(city) {
  if (city.country === "United States") {
    return city.city + ", " + getStateAbbrev(city.region);
  } else {
    return city.city + ", " + city.country;
  }
}

function Publisher(props) {
  const publisher = props.publisher;
  const incolumn = props.incolumn;

  const name = publisher.name;
  const parentName = publisher.parentName;
  const city = getCity(publisher.city);
  const isIndependent = publisher.isIndependent;

  var publisherText;

  if (name === parentName) {
    publisherText = (
      <div>
        Published in by <b>{name}</b> ({city}), which is{" "}
        <b>{getIsIndependentText(isIndependent)} independent</b>. Originally
        appeared in <b>{props.publishedYear}</b>.
      </div>
    );
  } else {
    publisherText = (
      <div>
        Published by <b>{name}</b> ({city}), which is an imprint of{" "}
        <b>{parentName}</b>, which is{" "}
        <b>{getIsIndependentText(isIndependent)} independent</b>. Originally
        appeared in <b>{props.publishedYear}</b>.
      </div>
    );
  }

  const style = {
    width: incolumn ? `100%` : `19%`,
    textAlign: incolumn ? `center` : `justify`,
    paddingBottom: incolumn ? `10px` : null,
  };

  return (
    <div className="publisher" style={style}>
      <div className="title">
        <u>Publisher Info</u>
      </div>
      {publisherText}
    </div>
  );
}

function Language(props) {
  const language = props.language;
  const originalLanguage = props.originalLanguage;
  const incolumn = props.incolumn;

  var languageText;

  if (props.translator === null) {
    languageText = (
      <div>
        This book was written and read in <b>{language}</b>.
      </div>
    );
  } else {
    const translatorName = props.translator.name;
    languageText = (
      <div>
        This book was read in <b>{language}</b>, but was written in{" "}
        <b>{originalLanguage}</b> and translated by <b>{translatorName}</b>.
      </div>
    );
  }

  const style = {
    width: incolumn ? `100%` : `19%`,
    textAlign: incolumn ? `center` : `justify`,
    paddingBottom: incolumn ? `10px` : null,
  };

  return (
    <div className="language" style={style}>
      <div className="title">
        <u>Language Info</u>
      </div>
      {languageText}
    </div>
  );
}

function Purchase(props) {
  const locationType = props.purchase.locationType;
  const location = props.purchase.location;
  const incolumn = props.incolumn;

  var info = "";

  if (locationType === "GIFT") {
    info = (
      <div>
        This book was a <b>gift</b>!
      </div>
    );
  } else if (locationType === "BOOKSTORE") {
    if (location.isLibrary) {
      info = (
        <div>
          This book was borrowed from <b>{location.name}</b> in{" "}
          {getCity(location.city)}.
        </div>
      );
    } else {
      info = (
        <div>
          This book was purchased from <b>{location.name}</b> in{" "}
          {getCity(location.city)}
        </div>
      );
    }
  } else if (locationType === "WEBSITE") {
    info = (
      <div>
        This book was purchased on <b>{location.website}</b>.
      </div>
    );
  } else {
    info = (
      <div>
        This book was purchased on <b>{location.website}</b>, which is
        affiliated with <b>{location.name}</b> in
        {getCity(location.city)}.
      </div>
    );
  }

  const style = {
    width: incolumn ? `100%` : `19%`,
    textAlign: incolumn ? `center` : `justify`,
    paddingBottom: incolumn ? `10px` : null,
  };

  return (
    <div className="purchase" style={style}>
      <div className="title">
        <u>Purchase Info</u>
      </div>
      {info}
    </div>
  );
}

function formatSubgenre(genre) {
  return genre.toLowerCase().replace("_", " ");
}

function Genre(props) {
  const genre = props.genre;
  const subgenre = props.subgenre;
  const format = props.format;
  const incolumn = props.incolumn;

  var genreInfo = "";
  var formatInfo = "";

  if (genre === "FICTION") {
    if (subgenre === "THRILLER") {
      genreInfo = (
        <div>
          This work of <b>fiction</b> could be considered a <b>thriller</b>.
        </div>
      );
    } else if (subgenre === "OTHER") {
      <div>
        this work of <b>fiction</b> does not have a clear genre.
      </div>;
    } else {
      genreInfo = (
        <div>
          This work of <b>fiction</b> could be considered{" "}
          <b>{formatSubgenre(subgenre)}</b>.
        </div>
      );
    }

    if (format === "LONG") {
      formatInfo = (
        <div className="format">
          The book is a <b>novel</b>.
        </div>
      );
    } else if (format === "MEDIUM") {
      formatInfo = (
        <div className="format">
          The book is a <b>novella</b>.
        </div>
      );
    } else if (format === "MULTIPLE_SHORT") {
      formatInfo = (
        <div className="format">
          The book consists of <b>multiple shorter pieces</b>.
        </div>
      );
    }
  } else if (genre === "POETRY") {
    genreInfo = (
      <div>
        This is a <b>poetry</b> book.
      </div>
    );
  } else if (genre === "NON_FICTION") {
    if (subgenre === "OTHER") {
      genreInfo = (
        <div>
          This is a <b>non-fiction</b> book.
        </div>
      );
    } else {
      genreInfo = (
        <div>
          This is a <b>non-fiction</b> book that is a{" "}
          <b>{formatSubgenre(subgenre)}</b>.
        </div>
      );
    }

    if (format === "LONG") {
      formatInfo = (
        <div className="format">
          The book is a single <b>long</b> work.
        </div>
      );
    } else if (format === "MEDIUM") {
      formatInfo = (
        <div className="format">
          The book is neither a long work nor a series of shorter works.
        </div>
      );
    } else if (format === "MULTIPLE_SHORT") {
      formatInfo = (
        <div className="format">
          The book consists of multiple <b>shorter pieces</b>.
        </div>
      );
    }
  }

  const style = {
    width: incolumn ? `100%` : `19%`,
    textAlign: incolumn ? `center` : `justify`,
    paddingBottom: incolumn ? `10px` : null,
  };

  return (
    <div className="genre" style={style}>
      <div className="title">
        <u>Genre</u>
      </div>
      {genreInfo} {formatInfo}
    </div>
  );
}

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExtra: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  getClassName() {
    if (this.props.entry.isReadCompletely) {
      return "entry completed";
    } else {
      return "entry notCompleted";
    }
  }

  getDisplay() {
    if (this.state.showExtra) {
      return "inline";
    } else {
      return "none";
    }
  }

  handleClick() {
    this.setState((prevState) => ({
      showExtra: !prevState.showExtra,
    }));
  }

  render() {
    const incolumn = this.props.incolumn;
    const entry = this.props.entry;

    const book = entry.book;
    const language = book.language;
    const originalLanguage = book.originalLanguage;
    const translator = book.translator;
    const publisher = book.publisher;
    const publishedYear = book.publishedYear;
    const genre = book.genre;
    const subgenre = book.subgenre;
    const format = book.format;

    var style = null;
    if (!this.state.showExtra) {
      style = { display: "none" };
    }

    return (
      <li className={this.getClassName()}>
        <div className="entry" onClick={this.handleClick}>
          <div className="entryHeader">
            <BookHeader book={entry.book} incolumn={incolumn} />
            <RatingHeader entry={entry} incolumn={incolumn} />
          </div>
          <div className="entryExtra" style={style}>
            <Publisher
              publisher={publisher}
              publishedYear={publishedYear}
              incolumn={incolumn}
            />
            <Genre
              genre={genre}
              subgenre={subgenre}
              format={format}
              incolumn={incolumn}
            />
            <Language
              language={language}
              originalLanguage={originalLanguage}
              translator={translator}
              incolumn={incolumn}
            />
            <Purchase purchase={entry.purchase} incolumn={incolumn} />
          </div>
        </div>
      </li>
    );
  }
}

export default Entry;
