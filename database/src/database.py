"""create the database schema

    the reading_list table is our fact table
    dimension tables are not manually curated
    enum tables are manually curated dimension tables
        and are prefixed with enum_
"""
from enum import EnumMeta
from typing import TypeVar

from sqlalchemy.engine.base import Engine

from .data_types import (FormatEnum, GenderEnum, GenreEnum,
                         PurchaseLocationTypeEnum, SubGenreEnum)


E = TypeVar("E", bound=EnumMeta)


def _execute(sql: str, engine: Engine):
    """execute a sql statement in context"""
    with engine.connect() as con:
        con.execute(sql)


def _create_table(create: str, insert: str, engine: Engine):
    """create a table

    Arguments:
        create (str): the creation sql statement
        insert (str): the initial insert sql statement
        engine (Engine): the engine to use
    """
    _execute(create, engine)
    _execute(insert, engine)


def _create_enum_table(name: str, enum: E, engine: Engine):
    """create enum table named enum_name

    Arguments:
        name (str): name of the enum
        enum (E): a class which subclasses Enum
        engine (Engine): the engine to use
    """
    table_name = f"enum_{name}"
    id_col = f"{name}_id"
    col = f"{name}"

    create = """
    CREATE TABLE {0} (
        {1} INTEGER PRIMARY KEY,
        {2} TEXT NULL UNIQUE
    );
    """.format(
        table_name, id_col, col
    )

    # I do not know how to type hint Enums, apparently
    values = ",".join(f'({i+1}, "{e.value}")' for i, e in enumerate(enum))  # type: ignore  # noqa
    insert = """
    INSERT INTO {0} ({1}, {2})
    VALUES (0, null),{3};
    """.format(
        table_name, id_col, col, values
    )
    _create_table(create, insert, engine)


def create_author_table(engine: Engine):
    """create author dimension table"""
    create = """
    CREATE TABLE author (
        author_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        birth_year INTEGER NULL,
        gender_id INTEGER NUL NULL,
        FOREIGN KEY (gender_id) REFERENCES gender(gender_id)
    );
    """
    insert = """
    INSERT INTO author (author_id, name)
    VALUES (0, "");
    """
    _create_table(create, insert, engine)


def create_author_list_table(engine: Engine):
    """create author list dimension table

    values should be parsable by json_array and
    all values should be foreign keys in the
    author dimension table
    """
    create = """
    CREATE TABLE author_list (
        author_list_id INTEGER PRIMARY KEY,
        author_list TEXT NOT NULL
    );
    """
    insert = """
    INSERT INTO author_list (author_list_id, author_list)
    VALUES (0, "");
    """
    _create_table(create, insert, engine)


def create_city_table(engine: Engine):
    """create city dimension table"""
    create = """
    CREATE TABLE city (
        city_id INTEGER PRIMARY KEY,
        city TEXT NOT NULL,
        region TEXT NOT NULL,
        country TEXT NOT NULL,
        UNIQUE(country, region, city)
    );
    """

    insert = """
    INSERT INTO city (city_id, city, region, country)
    VALUES (0, "", "", "");
    """
    _create_table(create, insert, engine)


def create_website_table(engine: Engine):
    """create website dimension table"""
    create = """
    CREATE TABLE website (
        website_id INTEGER PRIMARY KEY,
        website TEXT NOT NULL UNIQUE
    );
    """

    insert = """
    INSERT INTO website (website_id, website)
    VALUES (0, "");
    """
    _create_table(create, insert, engine)


def create_publisher_table(engine: Engine):
    """create publisher dimension table"""
    create = """
    CREATE TABLE publisher (
        publisher_id INTEGER PRIMARY KEY,
        name TEXT NULL UNIQUE,
        parent_name TEXT NULL,
        city_id INTEGER NOT NULL,
        FOREIGN KEY (city_id) REFERENCES city(city_id)
    );
    """

    insert = """
    INSERT INTO publisher (publisher_id, city_id)
    VALUES (0, 0);
    """
    _create_table(create, insert, engine)


def create_language_table(engine: Engine):
    """create language dimension table"""
    create = """
    CREATE TABLE language (
        language_id INTEGER PRIMARY KEY,
        language TEXT NULL UNIQUE
    );
    """
    insert = """
    INSERT INTO language (language_id)
    VALUES (0);
    """
    _create_table(create, insert, engine)


def create_book_table(engine: Engine):
    """create the book dimension table

    Sorry to any books with multiple translators
    and whatever else I'm simplifying...
    """
    create = """
    CREATE TABLE book (
        book_id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author_list_id INTEGER NOT NULL,
        language_id INTGER NOT NULL,
        translator_id INTEGER NOT NULL,
        original_language_id INTEGER NOT NULL,
        published_year INTEGER NOT NULL,
        genre_id INTEGER NOT NULL,
        subgenre_id INTEGER NOT NULL,
        format_id INTEGER NOT NULL,
        FOREIGN KEY (author_list_id) REFERENCES author_list(author_list_id),
        FOREIGN KEY (language_id) REFERENCES language(language_id),
        FOREIGN KEY (translator_id) REFERENCES author(author_id),
        FOREIGN KEY (original_language_id) REFERENCES language(language_id),
        FOREIGN KEY (genre_id) REFERENCES genre(genre_id),
        FOREIGN KEY (subgenre_id) REFERENCES subgenre(subgenre_id),
        FOREIGN KEY (format_id) REFERENCES format(format_id)
    );
    """
    insert = """
    INSERT INTO book (
        book_id,
        title,
        author_list_id,
        language_id,
        translator_id,
        original_language_id,
        published_year,
        genre_id,
        subgenre_id,
        format_id
    )
    VALUES (0, "", 0, 0, 0, 0, 0, 0, 0, 0);
    """
    _create_table(create, insert, engine)


def create_reading_list_table(engine: Engine):
    """create reading list fact table"""
    create = """
    CREATE TABLE reading_list (
        reading_list_id INTEGER PRIMARY KEY,
        book_id INTEGER NOT NULL UNIQUE,
        purchase_location_type_id INTEGER NOT NULL,
        bookstore_name TEXT NULL,
        bookstore_city_id INTEGER NOT NULL,
        website TEXT NULL,
        FOREIGN KEY (book_id) REFERENCES book(book_id),
        FOREIGN KEY (purchase_location_type_id) REFERENCES enum_purchase_location_type (purchase_location_type_id),
        FOREIGN KEY (bookstore_city_id) REFERENCES city(city_id)
    );
    """  # noqa
    _execute(create, engine)


def setup_database(engine: Engine):
    """setup database using the engine"""

    # enums
    _create_enum_table("gender", GenderEnum, engine)
    _create_enum_table("genre", GenreEnum, engine)
    _create_enum_table("subgenre", SubGenreEnum, engine)
    _create_enum_table("format", FormatEnum, engine)
    _create_enum_table("purchase_location_type", PurchaseLocationTypeEnum, engine)

    # dimensions
    create_author_table(engine)
    create_author_list_table(engine)
    create_city_table(engine)
    create_website_table(engine)
    create_publisher_table(engine)
    create_language_table(engine)
    create_book_table(engine)

    # fact table
    create_reading_list_table(engine)
