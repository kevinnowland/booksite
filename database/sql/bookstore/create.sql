CREATE TABLE bookstore (
  bookstore_id INTEGER PRIMARY KEY,
  name TEXT NULL,
  city_id INTEGER NOT NULL,
  FOREIGN KEY (city_id) REFERENCES city(city_id),
  UNIQUE(name)
);
