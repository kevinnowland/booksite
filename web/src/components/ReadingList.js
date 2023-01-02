import React from 'react';
import _ from "lodash";
import '../assets/ReadingList.css';


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

function getOriginalLanguage(lang, orig_lang) {
  if (lang === orig_lang) {
    return "-"
  } else {
    return orig_lang
  }
}

function dateText(date_string) {
  const d = new Date(date_string);
  const options = {day: 'numeric', month: 'short', year: 'numeric'};
  return d.toLocaleDateString("en-US", options)
}

function checkOrX(is_read_completely) {
  if (is_read_completely) {
    return "\u2713"
  } else {
    return "\u2717"
  }
}

function checkOrNone(is_read_completely) {
  if (is_read_completely) {
    return "\u2713"
  } else {
    return ""
  }
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

function toTableRow(entry) {
  return (
    <tr key={entry.book.title}>
      <td className="title">{entry.book.title}</td>
      <td className="authors">{getAuthors(entry.book.authors)}</td>
      <td className="language center">{entry.book.language}</td>
      <td className="originaLanguage center">{getOriginalLanguage(entry.book.language, entry.book.original_language)}</td>
      <td className="publisher center">{entry.book.publisher.parent_name}</td>
      <td className="isIndie center">{checkOrNone(entry.book.publisher.is_independent)}</td>
      <td className="stoppedReadingDate center">{dateText(entry.stopped_reading_date)}</td>
      <td className="isReadCompletely center">{checkOrX(entry.is_read_completely)}</td>
      <td className="starRating center">{starRating(entry.rating)}</td>
    </tr>
  )
}

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

function sortEntries(entries) {
  var sortedEntries = _.cloneDeep(entries);
  sortedEntries.sort(compareEntries);
  return sortedEntries
}

class ReadingList extends React.Component {

  render() {

    const sortedEntries = sortEntries(this.props.reading_list.entries)
    const tableRows = sortedEntries.map(toTableRow);

    return (
      <div className="readingList">
        <table className="readingList">
          <thead>
            <tr>
              <th className="title">Title</th>
              <th className="authors">Author(s)</th>
              <th className="language">Language</th>
              <th className="originalLanguage">Original Language</th>
              <th className="publisher">Publisher</th>
              <th className="isIndie">Indie?</th>
              <th className="stoppedReadingDate">Stopped Reading</th>
              <th className="isReadCompletely">Completed?</th>
              <th className="starRating">Rating</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    )
  }
}

export default ReadingList;
