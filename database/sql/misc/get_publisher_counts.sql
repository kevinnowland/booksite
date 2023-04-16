SELECT
  p.parent_name AS name
  ,p.is_independent
  ,count(1) as 'count'
FROM
  reading_list AS rl
  JOIN book AS b
  ON rl.book_id = b.book_id
  JOIN publisher AS p
  ON b.publisher_id = p.publisher_id
GROUP BY
  p.parent_name
  ,p.is_independent
ORDER BY
  is_independent asc,
  count desc,
  name asc
;
