SELECT
  c.city_id as city_id
  ,c.city as name
  ,c.region as state
  ,p.name as publisher_name
  ,b.title as title
FROM
  book as b
  join publisher as p
  on b.publisher_id = p.publisher_id
  join city as c
  on p.city_id = c.city_id
WHERE
  c.country = 'United States'
;
