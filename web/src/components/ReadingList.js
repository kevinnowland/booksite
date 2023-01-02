import React from 'react';
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
      <td className="stoppedReadingDate">{dateText(entry.stopped_reading_date)}</td>
      <td className="isReadCompletely">{checkOrX(entry.is_read_completely)}</td>
      <td className="starRating">{starRating(entry.rating)}</td>
    </tr>
  )
}

class ReadingList extends React.Component {

  render() {

    const tableRows = this.props.reading_list.entries.map(toTableRow);

    return (
      <div className="readingList">
        <table className="readingList">
          <thead>
            <tr>
              <th className="title">Title</th>
              <th className="authors">Author(s)</th>
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
