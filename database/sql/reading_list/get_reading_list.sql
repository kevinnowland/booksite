SELECT
    b.title,
    al.author_list,
    b.published_year,
    p.name AS publisher_name,
    p.parent_name AS publisher_parent_name,
    pc.city AS publisher_city,
    pc.region AS publisher_region,
    pc.country AS publisher_country,
    p.is_independent,
    l.language,
    ol.language AS original_language,
    a.name AS translator_name,
    a.birth_year AS translator_birth_year,
    ge.gender AS translator_gender,
    g.genre,
    sg.subgenre,
    f.format,
    rl.stopped_reading_date,
    rl.is_read_completely,
    rl.was_gift,
    w.website,
    bs.name AS bookstore_name,
    bc.city AS bookstore_city,
    bc.region AS bookstore_region,
    bc.country AS bookstore_country,
    rl.rating
FROM
    reading_list AS rl
    JOIN book AS b
    ON b.book_id = rl.book_id
    JOIN bookstore AS bs
    ON bs.bookstore_id = rl.bookstore_id
    JOIN website AS w
    ON w.website_id = rl.website_id
    JOIN author_list AS al
    ON al.author_list_id = b.author_list_id
    JOIN publisher AS p
    ON p.publisher_id = b.publisher_id
    JOIN language AS l
    ON l.language_id = b.language_id
    JOIN language AS ol
    ON ol.language_id = b.original_language_id
    JOIN author AS a
    ON a.author_id = b.translator_id
    JOIN enum_genre AS g
    ON g.genre_id = b.genre_id
    JOIN enum_subgenre AS sg
    ON sg.subgenre_id = b.subgenre_id
    JOIN enum_format AS f
    ON f.format_id = b.format_id
    JOIN enum_gender AS ge
    ON ge.gender_id = a.gender_id
    JOIN city AS pc
    ON pc.city_id = p.city_id
    JOIN city AS bc
    ON bc.city_id = bs.city_id
;
