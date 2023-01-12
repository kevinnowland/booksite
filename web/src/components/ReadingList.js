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

function sortMapEntries(m) {
  const n = _.cloneDeep(m);
  for (let [k, v] of n) {
    n.set(k, sortRawEntries(v))
  }
  return n
}

// TODO: add unit test
function sortEntriesByDateRead(entries) {
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

  const sortedMap = sortMapEntries(entryMap)
  
  return sortMapKeys(sortedMap, false)
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
    const sortedV = sortMapEntries(v);
    sortedMap.set(k, sortMapKeysEntryLength(sortedV, false));
  }

  return sortedMap
}

// TODO: add unit test
function sortEntriesByDatePublished(entries) {
  const entryMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const publishedYear = entry.book.publishedYear;
    if (entryMap.has(publishedYear)) {
      entryMap.get(publishedYear).push(entry);
    } else {
      entryMap.set(publishedYear, [entry])
    }
  }

  const sortedMap = sortMapEntries(entryMap)
  return sortMapKeys(sortedMap, false);
}

// map of strings to maps of strings to lists
// get map from top level keys to total number
// of elements in the lists which are the elements of
// all maps under the top level key
function getNestedEntryCounts(m) {
  const counts = new Map();
  for (let [k, v] of m) {
    var count = 0;
    for (let e of v.entries()) {
      count += e.length;
    }
    counts.set(k, count);
  }
  return counts
}

// TODO: unit test
function sortEntriesByLanguage(entries) {
  const origMap = new Map();
  const transMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const language = entry.book.language;
    const originalLanguage = entry.book.originalLanguage;

    if (language === originalLanguage) {
      if (origMap.has(language)) {
        origMap.get(language).push(entry);
      } else {
        origMap.set(language, [entry]);
      }
    } else {
      const toKey = "to " + language;
      const fromKey = "from " + originalLanguage;
      if (transMap.has(toKey)) {
        if (transMap.get(toKey).has(fromKey)) {
          transMap.get(toKey).get(fromKey).push(entry);
        } else {
          transMap.get(toKey).set(fromKey, [entry]);
        }
      }
      else {
        transMap.set(toKey, new Map([[fromKey, [entry]]]));
      }
    }
  }

  // sort origMap
  const sortedOrigMap = sortMapEntries(sortMapKeysEntryLength(origMap, false));

  // sort transMap
  const counts = getNestedEntryCounts(transMap);
  const sortedTransMap = new Map([...transMap.entries()].sort((a, b) => counts.get(a) - counts.get(b)));
  for (let [k, v] of sortedTransMap) {
    sortedTransMap.set(k, sortMapEntries(sortMapKeysEntryLength(v, false)));
  }

  return new Map([["original", sortedOrigMap], ["translated", sortedTransMap]]);
}

function splitWords(str) {
  return str.split(/(\s+)/)
}

function capitalizeWords(str) {
  const words = splitWords(str);
  const capitals = words.map((word) => word[0].toUpperCase() + word.substring(1));
  return capitals.join(' ')
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

  getColor(value) {
    if (value === this.state.sortBy) {
      return "rgb(172, 172, 172)"
    } else {
      return "rgb(210, 210, 210)"
    }
  }

  render() {
    const sortValues = [
      "date read",
      "publisher",
      "date published",
      "language",
      "genre",
      "purchase info"
    ];
    const buttons = sortValues.map((value) => (
      <button
        key={value}
        className="sort"
        onClick={(e) => this.updateSortBy(e)}
        value={value}
        style={{backgroundColor: this.getColor(value)}}
      >
        {capitalizeWords(value)}
      </button>
    ));

    const sortedRawEntries = sortRawEntries(this.props.readingList.entries);
    const entries = sortedRawEntries.map((entry) => 
      <Entry key={entry.readingListId} entry={entry} />
    );
    
    const entriesByLanguage = sortEntriesByLanguage(this.props.readingList.entries);
    console.log(entriesByLanguage);

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
