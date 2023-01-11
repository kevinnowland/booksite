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

// TODO: add unit test
function getYear(dateString) {
  const date = new Date(dateString);
  return date.getFullYear().toString()
}

// TODO: add unit test
function sortMapKeys(m, asc) {
  if (asc) {
    const n = new Map([...m.entries()].sort())
    return n
  } else {
    const n = new Map([...m.entries()].sort().reverse())
    return n
  }
}

// TODO: add unit test
function sortMapKeysEntryLength(m, asc) {
  if (asc) {
    const n = new Map([...m.entries()].sort((a, b) => a[1].length - b[1].length));
    return n
  } else {
    const n = new Map([...m.entries()].sort((a, b) => b[1].length - a[1].length));
    return n
  }
}

// TODO: add unit test
function sortEntriesByDate(entries) {
  const entryMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = _.cloneDeep(entries[i]);
    const year = getYear(entry.stoppedReadingDate);

    if (entryMap.has(year)) {
      entryMap.get(year).push(entry);
    } else {
      entryMap.set(year, [entry]);
    }
  }

  for (let [k, v] of entryMap) {
    entryMap.set(k, sortRawEntries(v))
  }
  
  return sortMapKeys(entryMap, false)
}

function getIsIndieKey(entry) {
  if (entry.book.publisher.isIndependent) {
    return "indie"
  } else {
    return "not indie"
  }
}

function sortEntriesByPublisher(entries) {
  const entryMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = _.cloneDeep(entries[i]);
    const isIndieKey = getIsIndieKey(entry);
    const publisher = entry.book.publisher.name;

    if (!entryMap.has(isIndieKey)) {
      entryMap.set(isIndieKey, new Map());
    }

    if (entryMap.get(isIndieKey).has(publisher)) {
      entryMap.get(isIndieKey).get(publisher).push(entry);
    } else {
      entryMap.get(isIndieKey).set(publisher, [entry]);
    }
  }

  const sortedMap = sortMapKeys(entryMap, true);
  for (let [k, v] of sortedMap) {
    for (let [kk, vv] of v) {
      v.set(kk, sortRawEntries(vv))
    }
    sortedMap.set(k, sortMapKeysEntryLength(v, false));
  }

  return sortedMap
}

class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {sortBy: 'date read'};

    this.updateSortBy = this.updateSortBy.bind(this);
  }

  updateSortBy(e) {
    this.setState(prevState => ({
      sortBy: e.target.value
    }));
  }

  splitWords(str) {
    return str.split(/(\s+)/)
  }

  capitalizeWords(str) {
    const words = this.splitWords(str);
    const capitals = words.map((word) => word[0].toUpperCase() + word.substring(1));
    return capitals.join(' ')
  }

  getColor(value) {
    if (value === this.state.sortBy) {
      return "rgb(172, 172, 172)"
    } else {
      return "rgb(210, 210, 210)"
    }
  }

  render() {
    const sortValues = ["date read", "publisher", "date published", "genre", "purchase"];
    const buttons = sortValues.map((value) => (
      <button
        key={value}
        className="sort"
        onClick={(e) => this.updateSortBy(e)}
        value={value}
        style={{backgroundColor: this.getColor(value)}}
      >
        {this.capitalizeWords(value)}
      </button>
    ));

    const sortedRawEntries = sortRawEntries(this.props.readingList.entries);
    const entries = sortedRawEntries.map((entry) => 
      <Entry key={entry.readingListId} entry={entry} />
    );

    const publisherEntries = sortEntriesByPublisher(this.props.readingList.entries);
    console.log(publisherEntries);

    const dateEntries = sortEntriesByDate(this.props.readingList.entries);
    console.log(dateEntries);

    return (
      <div className="readingList">
        <div className="sortOptions">
          Sort by:&nbsp;
          {buttons}
        </div>
        <ul className="readingList">{entries}</ul>
      </div>
    )
  }
}

export default ReadingList;
