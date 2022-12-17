CREATE TABLE book (
    book_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author_list_id INTEGER NOT NULL,
    language_id INTGER NOT NULL,
    translator_id INTEGER NOT NULL,
    original_language_id INTEGER NOT NULL,
    published_year INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    subgenre_id INTEGER NOT NULL,
    format_id INTEGER NOT NULL,
    FOREIGN KEY (author_list_id) REFERENCES author_list(author_list_id),
    FOREIGN KEY (language_id) REFERENCES language(language_id),
    FOREIGN KEY (translator_id) REFERENCES author(author_id),
    FOREIGN KEY (original_language_id) REFERENCES language(language_id),
    FOREIGN KEY (genre_id) REFERENCES genre(genre_id),
    FOREIGN KEY (subgenre_id) REFERENCES subgenre(subgenre_id),
    FOREIGN KEY (format_id) REFERENCES format(format_id),
    CONSTRAINT check_pub_year CHECK(
        (
            published_year > 1000
            AND published_year < 2100
        )
        OR published_year == 0
    )
);
