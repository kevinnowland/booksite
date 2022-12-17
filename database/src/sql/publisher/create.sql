CREATE TABLE publisher (
    publisher_id INTEGER PRIMARY KEY,
    name TEXT NULL UNIQUE,
    parent_name TEXT NULL,
    city_id INTEGER NOT NULL,
    is_independent INTEGER NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city(city_id)
);
