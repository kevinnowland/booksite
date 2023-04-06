SELECT
  l1.language AS language
  ,l2.language AS original_language
  ,count(1) as ct
FROM
  reading_list AS rl
  JOIN book AS B
  ON rl.book_id = b.book_id
  JOIN language AS l1
  ON b.language_id = l1.language_id
  JOIN language as l2
  ON b.original_language_id = l2.language_id
WHERE
  l1.language_id > 0
  AND l2.language_id > 0
GROUP BY
  l1.language
  ,l2.language
;
