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

  render() {
    const sortedRawEntries = sortRawEntries(this.props.readingList.entries);
    const entries = sortedRawEntries.map((entry) => 
      <Entry key={entry.readingListId} entry={entry} />
    );

    return (
      <div className="readingList">
        <div className="sortOptions">
          <button
            className="sort"
            onClick={(e) => this.updateSortBy(e)}
            value="date">
            Date
          </button>
          <button
            className="sort"
            onClick={(e) => this.updateSortBy(e)}
            value="publisher">
            Publisher
          </button>
          <button
            className="sort"
            onClick={(e) => this.updateSortBy(e)}
            value="genre">
            Genre
          </button>
          <button
            className="sort"
            onClick={(e) => this.updateSortBy(e)}
            value="purchase">
            Purchase
          </button>
        </div>
        <ul className="readingList">{entries}</ul>
      </div>
    )
  }
}

export default ReadingList;
