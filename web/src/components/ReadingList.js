import React from 'react';
import _ from "lodash";
import '../assets/ReadingList.css';

function compareEntries(a, b) {
  const aDate = new Date(a.stoppedReadingDate)
  const bDate = new Date(b.stoppedReadingDate)

  if (aDate < bDate) {
    return 1
  } else if (aDate > bDate) {
    return -1
  } else {
    return 0
  }
}

function sortRawEntries(entries) {
  var sortedEntries = _.cloneDeep(entries);
  sortedEntries.sort(compareEntries);
  return sortedEntries
}

function getEntryKey(entry) {
  return entry.book.title + '-' + entry.stoppedReadingDate
}

function getEntryClassName(entry) {
  if (entry.isReadCompletely) {
    return "entry completed"
  } else {
    return "entry notCompleted"
  }
}

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
    return 'is indie'
  } else {
    return 'is NOT indie'
  }
}

function Publisher(props) {
  var list;
  if (props.publisher.name === props.publisher.parentName) {
    list = (
      <ul className='dashed'>
        <li key='name'>{props.publisher.name}</li>
        <li key='isIndependent'>{getIsIndependentText(props.isIndendent)}</li>
      </ul>
    )
  } else {
      list =(
        <ul className='dashed'>
          <li key='name'>{props.publisher.name}</li>
          <li key='parentName'>{props.publisher.parentName}</li>
          <li key='isIndependent'>{getIsIndependentText(props.isIndendent)}</li>
        </ul>
      )
  }
  return (
    <div className="publisher">
      <div className='title'><u>Publisher Info</u></div>
      {list}
    </div>
  )
}

function Language(props) {
  var list;
  if (props.translator === null) {
    list = 
      <ul className='dashed'>
        <li key="language">read in {props.language}</li>
      </ul>
  } else {
    list = (
      <ul className='dashed'>
        <li key="language">read in {props.language}</li>
        <li key="originalLanguage">written in {props.originalLanguage}</li>
          <li key="translator">translated by {props.translator.name}</li>
      </ul>
    )
  }
  return (
    <div className='language'>
      <div className='title'><u>Language Info</u></div>
      {list}
    </div>
  )
}

function Purchase(props) {
  return (
    <div className='purchase'>
      <div className='title'><u>Purchase Info</u></div>
    </div>
  )
}

class Entry extends React.Component {

  render () {
    const entry = this.props.entry;
    const book = entry.book;
    const language = book.language;
    const originalLanguage = book.originalLanguage;
    const translator = book.translator;
    const publisher = book.publisher;
    
    return (
      <li className={getEntryClassName(entry)}>
        <div className="entry">
          <div className="entryHeader">
            <BookHeader book={entry.book} />
            <RatingHeader entry={entry} />
          </div>
          <div className="entryExtra">
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


class ReadingList extends React.Component {

  render() {
    const sortedRawEntries = sortRawEntries(this.props.readingList.entries);
    const entries = sortedRawEntries.map((entry) => 
      <Entry key={getEntryKey(entry)} entry={entry} />
    );

    return (
      <ul className="readingList">{entries}</ul>
    )
  }
}

export default ReadingList;
