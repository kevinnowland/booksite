INSERT INTO reading_list 
(
  book_id,
  stopped_reading_date,
  is_read_completely,
  purchase_location_type_id,
  bookstore_name,
  bookstore_city_id,
  website
)
VALUES
(
  {book_id},
  {stopped_reading_date},
  {is_read_completely},
  {purchase_location_type_id},
  {bookstore_name},
  {bookstore_city_id},
  {website}
)
