CREATE TABLE bookstore (
  bookstore_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  city_id INTEGER NOT NULL,
  FOREIGN KEY (city_id) REFERENCES city(city_id),
);
