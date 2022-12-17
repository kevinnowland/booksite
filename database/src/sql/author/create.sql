CREATE TABLE author (
    author_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    birth_year INTEGER NOT NULL,
    gender_id INTEGER NOT NULL,
    FOREIGN KEY (gender_id) REFERENCES gender(gender_id),
    CONSTRAINT check_is_year CHECK(
        (
            birth_year >= 1000
            AND birth_year < 2100
        )
        OR birth_year == 0
    )
);
