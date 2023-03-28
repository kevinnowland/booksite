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
  return (
    <div className="bookHeader">
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
  const d = new Date(date_string);
  const options = { day: "numeric", month: "short", year: "numeric" };
  const dateString = d.toLocaleDateString("en-US", options);
  return dateString;
}

function RatingHeader(props) {
  const rating = props.entry.rating;
  const stoppedReadingDate = props.entry.stoppedReadingDate;
  return (
    <div className="ratingHeader">
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

  return (
    <div className="publisher">
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
  return (
    <div className="language">
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

  return (
    <div className="purchase">
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

  return (
    <div className="genre">
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
            <BookHeader book={entry.book} />
            <RatingHeader entry={entry} />
          </div>
          <div className="entryExtra" style={style}>
            <Publisher publisher={publisher} publishedYear={publishedYear} />
            <Genre genre={genre} subgenre={subgenre} format={format} />
            <Language
              language={language}
              originalLanguage={originalLanguage}
              translator={translator}
            />
            <Purchase purchase={entry.purchase} />
          </div>
        </div>
      </li>
    );
  }
}

export default Entry;
