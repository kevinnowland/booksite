CREATE TABLE city (
    city_id INTEGER PRIMARY KEY,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT NOT NULL,
    UNIQUE(country, region, city)
);
