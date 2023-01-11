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

class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {sortBy: 'date'};

    this.updateSortBy = this.updateSortBy.bind(this);
  }

  updateSortBy(e) {
    this.setState(prevState => ({
      sortBy: e.target.value
    }));
  }

  capitalize(str) {
    return str[0].toUpperCase() + str.substring(1)
  }

  render() {
    const sortedRawEntries = sortRawEntries(this.props.readingList.entries);
    const entries = sortedRawEntries.map((entry) => 
      <Entry key={entry.readingListId} entry={entry} />
    );
    const sortValues = ["date", "publisher", "genre", "purchase"];
    const buttons = sortValues.map((value) => (
      <button
        key={value}
        className="sort"
        onClick={(e) => this.updateSortBy(e)}
        value={value}
      >
        {this.capitalize(value)}
      </button>
    ));

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
