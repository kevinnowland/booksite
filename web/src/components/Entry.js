import React from 'react';
import '../assets/Entry.css';

function getAuthors(authors) {
  var author_list = "";
  authors.forEach((author, i) => {
    if (i > 0) {
      author_list += ", "
    }
    author_list += author.name
  });
  return author_list
}

function BookHeader(props) {
  const book = props.book;
  return (
    <div className="bookHeader">
      <div className="title">{book.title}</div>
      <div className="authors">{getAuthors(book.authors)}</div>
    </div>
  )
}

function starRating(rating) {
  var stars = ""
  for (let i = 0; i < 5; i ++) {
    if (i < rating ) {
      stars += "\u2605"
    } else {
      stars += "\u2606"
    }
  }
  return stars
}

function dateText(date_string) {
  const d = new Date(date_string);
  const options = {day: 'numeric', month: 'short', year: 'numeric'};
  const dateString = d.toLocaleDateString("en-US", options)
  return dateString
}

function RatingHeader(props) {
  const rating = props.entry.rating;
  const stoppedReadingDate = props.entry.stoppedReadingDate;
  return (
    <div className="ratingHeader">
      <div className="rating">{starRating(rating)}</div>
      <div className="stoppedReadingDate">{dateText(stoppedReadingDate)}</div>
    </div>
  )
}

function getIsIndependentText(isIndependent) {
  if (isIndependent) {
    return ''
  } else {
    return 'not'
  }
}

function getCity(city) {
  const stateAbbrevs = new Map([
    ["Alabama", "AL"],
    ["Alaska", "AK"],
    ["Arizona", "AZ"],
    ["Arkansa", "AR"],
    ["California", "CA"],
    ["Colorado", "CO"],
    ["Connecticut", "CT"],
    ["Delaware", "DE"],
    ["D.C.", "DC"],
    ["DC", "DC"],
    ["District of Columbia", "DC"],
    ["Florida", "FL"],
    ["Georgia", "GA"],
    ["Hawaii", "HI"],
    ["Idaho", "ID"],
    ["Illinois", "IL"],
    ["Indiana", "IN"],
    ["Iowa", "IA"],
    ["Kansas", "KS"],
    ["Kentucky", "KY"],
    ["Louisiana", "LA"],
    ["Maine", "ME"],
    ["Maryland", "MD"],
    ["Massachusetts", "MA"],
    ["Michigan", "MI"],
    ["Minnesota", "MN"],
    ["Mississippi", "MS"],
    ["Missouri", "MO"],
    ["Montana", "MT"],
    ["Nebraska", "NE"],
    ["Nevada", "NV"],
    ["New Hampshire", "NH"],
    ["New Jersey", "NJ"],
    ["New Mexico", "NM"],
    ["New York", "NY"],
    ["North Carolina", "NC"],
    ["North Dakota", "ND"],
    ["Ohio", "OH"],
    ["Oklahoma", "OK"],
    ["Oregon", "OR"],
    ["Pennsylvania", "OR"],
    ["Puerto Rico", "PR"],
    ["Rhode Island", "RI"],
    ["South Carolina", "SC"],
    ["South Dakota", "SD"],
    ["Tennessee", "TN"],
    ["Texas", "TX"],
    ["Utah", "UT"],
    ["Vermont", "UT"],
    ["Virgin Islands", "VI"],
    ["Virginia", "VA"],
    ["Washington", "WA"],
    ["West Virginia", "WV"],
    ["Wisconsin", "WI"],
    ["Wyoming", "WY"]
  ]);

  if (city.country === "United States") {
    return city.city + ", " + stateAbbrevs.get(city.region)
  } else {
    return city.city + ", " + city.country
  }
}

function Publisher(props) {
  const name = props.publisher.name;
  const parentName = props.publisher.parentName;
  const city = getCity(props.publisher.city);
  const isIndependent = props.publisher.isIndependent;

  var publisherText;

  if (name === parentName) {
    publisherText =(
      <div>
        Published by <b>{name}</b> ({city}),
        which is <b>{getIsIndependentText(isIndependent)} independent</b>.
      </div>
    )
  } else {
    publisherText = (
      <div>
        Published by <b>{name}</b> ({city}), which is an imprint of <b>{parentName}</b>, 
        which is <b>{getIsIndependentText(isIndependent)} independent</b>.
      </div>
    )
  }

  return (
    <div className="publisher">
      <div className="title"><u>Publisher Info</u></div>
      {publisherText}
    </div>
  )
}

function Language(props) {
  const language = props.language;
  const originalLanguage = props.originalLanguage;

  var languageText;

  if (props.translator === null) {
    languageText = (
      <div>This book was written and read in <b>{language}</b>.</div>
    );
  } else {
    const translatorName = props.translator.name;
    languageText = (
      <div>
        This book was read in <b>{language}</b>,
        but was written in <b>{originalLanguage}</b> and
        translated by <b>{translatorName}</b>.
      </div>
    );
  }
  return (
    <div className='language'>
      <div className='title'><u>Language Info</u></div>
      {languageText}
    </div>
  )
}


function Purchase(props) {
  const locationType = props.purchase.locationType;
  const location = props.purchase.location;

  var info = '';

  if (locationType === "GIFT") {
    info = <div>This book was a <b>gift</b>!</div>
  } else if (locationType === "BOOKSTORE") {
    if (location.isLibrary) {
      info = (
        <div>
          This book was borrowed from <b>{location.name}</b> in {getCity(location.city)}.
        </div>
      )
    } else {
      info = (
        <div>
          This book was purchased from <b>{location.name}</b> in {getCity(location.city)}
        </div>
      )
    }
  } else if (locationType === "WEBSITE") {
    info = (
      <div>
        This book was purchased on <b>{location.website}</b>.
      </div>
    )
  } else {
    info = (
      <div>
        This book was purchased on <b>{location.website}</b>,
        which is affiliated with <b>{location.name}</b> in
        {getCity(location.city)}.
      </div>
    )
  }

  return (
    <div className='purchase'>
      <div className='title'><u>Purchase Info</u></div>
      {info}
    </div>
  )
}


function getEntryClassName(entry) {
  if (entry.isReadCompletely) {
    return "entry completed"
  } else {
    return "entry notCompleted"
  }
}


class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExtra: false
    };

    this.handleClick= this.handleClick.bind(this);
  }

  getDisplay() {
    if (this.state.showExtra) {
      return "inline"
    } else {
      return "none"
    }
  }

  handleClick() {
    this.setState(prevState => ({
      showExtra: !prevState.showExtra
    }));
  }

  render () {
    const entry = this.props.entry;
    const book = entry.book;
    const language = book.language;
    const originalLanguage = book.originalLanguage;
    const translator = book.translator;
    const publisher = book.publisher;
    
    var style = null;
    if (!this.state.showExtra) {
      style = {display: 'none'}
    }

    
    return (
      <li className={getEntryClassName(entry)}>
        <div className="entry" onClick={this.handleClick}>
          <div className="entryHeader">
            <BookHeader book={entry.book} />
            <RatingHeader entry={entry} />
          </div>
          <div
            className="entryExtra"
            style={style}
          >
            <Publisher publisher={publisher}/>
            <Language
              language={language}
              originalLanguage={originalLanguage}
              translator={translator}
            />
            <Purchase purchase={entry.purchase} />
          </div>
        </div>
      </li>
    )
  }
}

export default Entry;
