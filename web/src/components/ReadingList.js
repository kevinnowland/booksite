import React from 'react';
import _ from "lodash";
import '../assets/ReadingList.css';

function compareEntries(a, b) {
  const aDate = new Date(a.stopped_reading_date)
  const bDate = new Date(b.stopped_reading_date)

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
  return entry.book.title + '-' + entry.stopped_reading_date
}

function getEntryClassName(entry) {
  if (entry.is_read_completely) {
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

class Entry extends React.Component {

  render () {
    const entry = this.props.entry
    
    return (
        <li className={getEntryClassName(entry)}>
        <div className="entry">
          <div className="title">{entry.book.title}</div>
          <div className="authors">{getAuthors(entry.book.authors)}</div>
          <div className="stoppedReadingDate">{entry.stopped_reading_date}</div>
        </div>
      </li>
    )
  }
}


class ReadingList extends React.Component {

  render() {
    const sortedRawEntries = sortRawEntries(this.props.reading_list.entries);
    const entries = sortedRawEntries.map((entry) => 
      <Entry key={getEntryKey(entry)} entry={entry} />
    );

    return (
      <ul className="readingList">{entries}</ul>
    )
  }
}

export default ReadingList;
