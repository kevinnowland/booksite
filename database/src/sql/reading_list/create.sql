CREATE TABLE reading_list (
    reading_list_id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL,
    stopped_reading_date TEXT NOT NULL,
    is_read_completely INTEGER NOT NULL,
    purchase_location_type_id INTEGER NOT NULL,
    bookstore_name TEXT NULL,
    bookstore_city_id INTEGER NOT NULL,
    website TEXT NULL,
    FOREIGN KEY (book_id) REFERENCES book(book_id),
    FOREIGN KEY (purchase_location_type_id) REFERENCES enum_purchase_location_type (purchase_location_type_id),
    FOREIGN KEY (bookstore_city_id) REFERENCES city(city_id),
    UNIQUE(book_id, stopped_reading_date),
    CONSTRAINT valid_date CHECK(stopped_reading_date IS date(stopped_reading_date, '+0 days'))
);
