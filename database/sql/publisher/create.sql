CREATE TABLE publisher (
    publisher_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    city_id INTEGER NOT NULL,
    is_independent INTEGER NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city(city_id),
    UNIQUE(name, parent_name)
);
