import React from "react";
import _ from "lodash";
import "../assets/ReadingList.css";
import Entry, { starRating } from "./Entry";
import { capitalizeWords, formatGenre } from "../common/utils";

function pushOrSet(m, k, entry) {
  if (m.has(k)) {
    m.get(k).push(entry);
  } else {
    m.set(k, [entry]);
  }
}

function compareEntries(a, b) {
  const aDate = new Date(a.stoppedReadingDate);
  const bDate = new Date(b.stoppedReadingDate);

  if (aDate < bDate) {
    return 1;
  } else if (aDate > bDate) {
    return -1;
  } else {
    return 0;
  }
}

function sortRawEntries(entries) {
  var sortedEntries = _.cloneDeep(entries);
  sortedEntries.sort(compareEntries);
  return sortedEntries;
}

// TODO: add unit test
function getYear(dateString) {
  const date = new Date(dateString.replace(/-/g, "/"));
  return date.getFullYear().toString();
}

// TODO: add unit test
function sortMapKeys(m, asc) {
  if (asc) {
    const n = new Map([...m.entries()].sort());
    return n;
  } else {
    const n = new Map([...m.entries()].sort().reverse());
    return n;
  }
}

// TODO: add unit test
function sortMapKeysEntryLength(m, asc) {
  if (asc) {
    const n = new Map(
      [...m.entries()].sort((a, b) => a[1].length - b[1].length)
    );
    return n;
  } else {
    const n = new Map(
      [...m.entries()].sort((a, b) => b[1].length - a[1].length)
    );
    return n;
  }
}

function sortMapEntries(m) {
  const n = _.cloneDeep(m);
  for (let [k, v] of n) {
    n.set(k, sortRawEntries(v));
  }
  return n;
}

// TODO: add unit test
function sortEntriesByDateRead(entries) {
  const entryMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = _.cloneDeep(entries[i]);
    const year = getYear(entry.stoppedReadingDate);

    pushOrSet(entryMap, year, entry);
  }

  const sortedMap = sortMapEntries(entryMap);

  return sortMapKeys(sortedMap, false);
}

function sortEntriesByPublisher(entries) {
  const entryMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = _.cloneDeep(entries[i]);
    const isIndependent = entry.book.publisher.isIndependent;
    const key = isIndependent ? "Independent Press" : "Mainstream Press";
    const publisher = isIndependent
      ? entry.book.publisher.name
      : entry.book.publisher.parentName;

    if (!entryMap.has(key)) {
      entryMap.set(key, new Map());
    }

    pushOrSet(entryMap.get(key), publisher, entry);
  }

  const sortedMap = sortMapKeys(entryMap, true);
  for (let [k, v] of sortedMap) {
    const sortedV = sortMapEntries(v);
    sortedMap.set(k, sortMapKeysEntryLength(sortedV, false));
  }

  return sortedMap;
}

// TODO: add unit test
function sortEntriesByDatePublished(entries) {
  const entryMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const publishedYear = entry.book.publishedYear;
    pushOrSet(entryMap, publishedYear, entry);
  }

  const sortedMap = sortMapEntries(entryMap);
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
  return counts;
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
      pushOrSet(origMap, language, entry);
    } else {
      const toKey = "Read in " + language;
      const fromKey = "Translated from " + originalLanguage;
      if (transMap.has(toKey)) {
        pushOrSet(transMap.get(toKey), fromKey, entry);
      } else {
        transMap.set(toKey, new Map([[fromKey, [entry]]]));
      }
    }
  }

  // sort origMap
  const sortedOrigMap = sortMapEntries(sortMapKeysEntryLength(origMap, false));

  // sort transMap
  const counts = getNestedEntryCounts(transMap);
  const sortedTransMap = new Map(
    [...transMap.entries()].sort((a, b) => counts.get(a) - counts.get(b))
  );
  for (let [k, v] of sortedTransMap) {
    sortedTransMap.set(k, sortMapEntries(sortMapKeysEntryLength(v, false)));
  }

  return new Map([
    ["Read in Original Language", sortedOrigMap],
    ["Read in Translation", sortedTransMap],
  ]);
}

function sortGenreMap(genreMap) {
  const sortedGenreMap = sortMapKeysEntryLength(genreMap, false);
  return sortMapEntries(sortedGenreMap);
}

function sortEntriesByGenre(entries) {
  const entryMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const genre = formatGenre(entry.book.genre);
    const subgenre = formatGenre(entry.book.subgenre);

    if (genre === "Poetry") {
      pushOrSet(entryMap, genre, entry);
    } else {
      if (!entryMap.has(genre)) {
        entryMap.set(genre, new Map());
      }
      pushOrSet(entryMap.get(genre), subgenre, entry);
    }
  }

  const sortedMap = new Map();
  if (entryMap.has("Fiction")) {
    sortedMap.set("Fiction", sortGenreMap(entryMap.get("Fiction")));
  }
  if (entryMap.has("Non Fiction")) {
    sortedMap.set("Non Fiction", sortGenreMap(entryMap.get("Non Fiction")));
  }
  if (entryMap.has("Poetry")) {
    sortedMap.set("Poetry", sortEntriesByDateRead(entryMap.get("Poetry")));
  }

  return sortedMap;
}

function sortEntriesByPurchaseInfo(entries) {
  const entryMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const locationType = entry.purchase.locationType;
    const location = entry.purchase.location;

    if (locationType === "GIFT") {
      pushOrSet(entryMap, "Gift", entry);
    } else if (
      locationType === "WEBSITE" ||
      locationType === "ONLINE_BOOKSTORE"
    ) {
      pushOrSet(entryMap, "Online", entry);
    } else if (locationType === "BOOKSTORE") {
      if (location.isLibrary) {
        pushOrSet(entryMap, "Library", entry);
      } else {
        pushOrSet(entryMap, "Bookstore", entry);
      }
    }
  }

  const sortedMap = sortMapKeysEntryLength(entryMap, false);

  return sortMapEntries(sortedMap);
}

function sortEntriesByRating(entries) {
  const entryMap = new Map([
    [starRating(5), []],
    [starRating(4), []],
    [starRating(3), []],
    [starRating(2), []],
    [starRating(1), []],
    [starRating(0), []],
  ]);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const rating = starRating(entry.rating);
    entryMap.get(rating).push(entry);
  }

  sortEntriesByDateRead(entryMap);

  return entryMap;
}

function KeyEntry(props) {
  return (
    <div className="keyEntry">
      <div className="color" style={{ backgroundColor: props.color }}></div>
      <div className="value">{props.value}</div>
    </div>
  );
}

function Key() {
  return (
    <div className="key">
      <KeyEntry value="Completed" color="#D6FFD6" />
      <KeyEntry value="Not Completed" color="lightyellow" />
    </div>
  );
}

class SortedEntries extends React.Component {
  render() {
    const k = this.props.k;
    const v = this.props.v;
    const n = this.props.n;
    const incolumn = this.props.incolumn;

    const headerClassName = "sortedEntryHeader level" + n.toString();
    const entryHeader = <div className={headerClassName}>{k}</div>;

    if (v instanceof Map) {
      const sortedEntries = [...v.entries()].map((e) => {
        return (
          <SortedEntries
            key={e[0]}
            k={e[0]}
            v={e[1]}
            n={n + 1}
            incolumn={incolumn}
          />
        );
      });
      return (
        <div className="sortedEntries">
          {entryHeader}
          {sortedEntries}
        </div>
      );
    }

    const entries = v.map((entry) => (
      <Entry key={entry.readingListId} entry={entry} incolumn={incolumn} />
    ));
    return (
      <div className="sortedEntries">
        {entryHeader}
        <ul className="readingList">{entries}</ul>
      </div>
    );
  }
}

class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sortBy: "date read" };

    this.updateSortBy = this.updateSortBy.bind(this);
  }

  updateSortBy(e) {
    this.setState({
      sortBy: e.target.value,
    });
  }

  getColor(value) {
    if (value === this.state.sortBy) {
      return "rgb(172, 172, 172)";
    } else {
      return "rgb(210, 210, 210)";
    }
  }

  render() {
    const incolumn = this.props.incolumn;

    const sortValues = [
      "date read",
      "publisher",
      "date published",
      "language",
      "genre",
      "purchase info",
      "rating",
    ];
    const buttons = sortValues.map((value) => (
      <button
        key={value}
        className="sort"
        onClick={(e) => this.updateSortBy(e)}
        value={value}
        style={{ backgroundColor: this.getColor(value) }}
      >
        {capitalizeWords(value)}
      </button>
    ));

    var entryMap;
    const entries = this.props.readingList.entries;
    const sortBy = this.state.sortBy;
    if (sortBy === "date read") {
      entryMap = sortEntriesByDateRead(entries);
    } else if (sortBy === "publisher") {
      entryMap = sortEntriesByPublisher(entries);
    } else if (sortBy === "date published") {
      entryMap = sortEntriesByDatePublished(entries);
    } else if (sortBy === "language") {
      entryMap = sortEntriesByLanguage(entries);
    } else if (sortBy === "genre") {
      entryMap = sortEntriesByGenre(entries);
    } else if (sortBy === "purchase info") {
      entryMap = sortEntriesByPurchaseInfo(entries);
    } else if (sortBy === "rating") {
      entryMap = sortEntriesByRating(entries);
    } else {
      throw new Error("invalid sort option");
    }

    return (
      <div className="readingList">
        <div className="sortOptions">
          Sort by:&nbsp;
          {buttons}
        </div>
        <Key />
        <SortedEntries k="top" v={entryMap} n={0} incolumn={incolumn} />
      </div>
    );
  }
}

export default ReadingList;
