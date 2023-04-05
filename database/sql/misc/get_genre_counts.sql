SELECT
  g.genre
  ,sg.subgenre
  ,count(1) as ct
FROM
  reading_list AS rl
  JOIN book AS b
  ON rl.book_id = b.book_id
  JOIN enum_genre AS g
  ON b.genre_id = g.genre_id
  JOIN enum_subgenre AS sg
  ON b.subgenre_id = sg.subgenre_id
WHERE
  g.genre_id > 0
  AND sg.subgenre_id > 0 
GROUP BY
  g.genre
  ,sg.subgenre
;

