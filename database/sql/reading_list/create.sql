CREATE TABLE reading_list (
    reading_list_id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL,
    stopped_reading_date TEXT NOT NULL,
    is_read_completely INTEGER NOT NULL,
    bookstore_id INTEGER NOT NULL,
    website_id INTEGER NOT NULL,
    FOREIGN KEY (book_id) REFERENCES book(book_id),
    FOREIGN KEY (bookstore_id) REFERENCES bookstore(bookstore_id),
    FOREIGN KEY (website_id) REFERENCES website(website_id),
    UNIQUE(book_id, stopped_reading_date),
    CONSTRAINT valid_date CHECK(stopped_reading_date IS date(stopped_reading_date, '+0 days'))
);
