import React from 'react';
import _ from 'lodash';
import '../assets/ReadingList.css';
import Entry from './Entry';

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
