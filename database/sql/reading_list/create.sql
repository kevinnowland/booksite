CREATE TABLE reading_list (
    reading_list_id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL,
    stopped_reading_date TEXT NOT NULL,
    is_read_completely INTEGER NOT NULL,
    was_gift INTEGER NOT NULL,
    bookstore_id INTEGER NOT NULL,
    website_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    FOREIGN KEY (book_id) REFERENCES book(book_id),
    FOREIGN KEY (bookstore_id) REFERENCES bookstore(bookstore_id),
    FOREIGN KEY (website_id) REFERENCES website(website_id),
    UNIQUE(book_id, stopped_reading_date),
    CONSTRAINT valid_date CHECK(stopped_reading_date IS date(stopped_reading_date, '+0 days')),
    CONSTRAINT valid_was_gift CHECK(was_gift = 0 OR was_gift = 1),
    CONSTRAINT valid_is_read_completely CHECK(is_read_completely = 0 OR is_read_completely = 1),
    CONSTRAINT valid_rating CHECK(rating >= 0 AND rating <= 5)
);
