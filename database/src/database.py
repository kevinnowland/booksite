"""create the database schema

    the reading_list table is our fact table
    dimension tables are not manually curated
    enum tables are manually curated dimension tables
        and are prefixed with enum_
"""
from datetime import date
from enum import EnumMeta
from typing import Any, Optional, TypeVar

from humps import decamelize
from sqlalchemy.engine.base import Engine

from .data_types import GenreEnum  # type: ignore
from .data_types import (Author, FormatEnum, GenderEnum,
                         PurchaseLocationTypeEnum, SubgenreEnum)

E = TypeVar("E", bound=EnumMeta)


class DimensionValueNotFoundError(Exception):
    pass


def _import_sql(table_name: str, statement: str) -> str:
    """read in sql for the table

    Arguments:
        table_name (str): name of the table
        statement (str): the statement type

    Returns:
        a string of sql
    """
    path = f"sql/{table_name}/{statement}.sql"
    with open(path, "r") as f:
        sql = f.read()
    return sql


def _execute(sql: str, engine: Engine):
    """execute a sql statement in context"""
    with engine.connect() as con:
        con.execute(sql)


def _import_and_execute(table_name: str, statement: str, engine: Engine):
    """import the file and execute it

    Assumes file named `sql/table_name/statement.sql` exists

    Arguments:
        table_name (str): the name of the table
        statement (str): the statement type with coresponding file
        engine (Engine): the engine to use
    """
    sql = _import_sql(table_name, statement)
    _execute(sql, engine)


def _parse_enum_name(enum: E) -> str:
    """get table name from enum class

    i.e., SomeThingEnum -> some_thing

    Arguments:
        enum (E): a class which subclasses Enum

    Returns:
        the corresponding table name str
    """
    raw_name = enum.__name__
    return decamelize(raw_name[:-4])


def _create_enum_table(enum: E, engine: Engine):
    """create enum table named enum_name

    Arguments:
        enum (E): a class which subclasses Enum
        engine (Engine): the engine to use
    """
    name = _parse_enum_name(enum)
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
    values = ",".join(f'({e.value}, "{e.name}")' for e in (enum))  # type: ignore
    insert = """
    INSERT INTO {0} ({1}, {2})
    VALUES (0, null),{3};
    """.format(
        table_name, id_col, col, values
    )
    _execute(create, engine)
    _execute(insert, engine)


def _create_dim_table(table_name: str, engine: Engine):
    """create a dimension table

    Assumes that we can import from
        `sql/table_name/create.sql`
        and `sql/table_name/insert.sql`

    Arguments:
        table_name (str): the name of the table
        engine (Engine): the engine to use
    """
    for statement in ["create", "insert"]:
        _import_and_execute(table_name, statement, engine)


def _create_fact_table(table_name: str, engine: Engine):
    """create reading list fact table

    Assumes a file named `sql/table_name/create.sql` exists

    Arguments:
        table_name (str): the name of the table
        engine (Engine): the engine to use
    """
    _import_and_execute(table_name, "create", engine)


def _munge_sql_val(val: Any) -> str:
    """munge python val into something fitting for sql"""
    if type(val) == str:
        return f"'{val}'"
    elif type(val) == bool:
        return "1" if val else "0"
    elif type(val) == list:
        return "'" + ",".join(str(i) for i in val) + "'"
    elif type(val) == date:
        return f"'{str(val)}'"
    elif val is None:
        return "null"
    else:
        return val


def _get_dim_id(
    table_name: str, uk_cols: list[str], uk_vals: list[Any], engine: Engine
) -> int:
    """get id of entry in dimension table

    Arguments:
        table_name (str): name of the table
        uk_cols (list[str]): list of cols in the unique constraint
        uk_vals (list[Any]): the list of values for those cols in same order
        engine (Engine): the engine to use

    Returns:
        id corresponding to the primary key
    """
    where = " AND ".join(
        f"{uk_cols[i]} = {_munge_sql_val(uk_vals[i])}" for i in range(len(uk_cols))
    )
    sql = f"""
    SELECT {table_name}_id
    FROM {table_name}
    WHERE {where};
    """
    results = engine.execute(sql)
    return results.first()[0]  # type: ignore


def _insert_table(table_name: str, engine: Engine, **data):
    """attempt to insert into dimension table

    Assumes file `sql/table_name/inset_template.sql`
        exists

    Arguments:
        table_name (str): the table name
        engine (Engine): the engine to use
        data: the data to insert
    """
    raw_sql = _import_sql(table_name, "insert_template")
    munged_data = {k: _munge_sql_val(v) for k, v in data.items()}
    sql = raw_sql.format(**munged_data)
    _execute(sql, engine)


def _insert_author(name: str, birth_year: int, gender_id: int, engine: Engine):
    """insert an author into the author table"""
    data = {
        "name": name,
        "birth_year": birth_year,
        "gender_id": gender_id,
    }
    _insert_table(table_name="author", engine=engine, **data)


def _insert_author_list(author_ids: list[int], engine: Engine):
    """insert list of author ids into author list"""
    data = {"author_list": author_ids}
    _insert_table("author_list", engine, **data)


def _insert_city(city: str, region: str, country: str, engine: Engine):
    """insert city into city table"""
    data = {
        "city": city,
        "region": region,
        "country": country,
    }
    _insert_table("city", engine, **data)


def _insert_website(website: str, engine: Engine):
    """insert website into website table"""
    data = {"website": website}
    _insert_table("website", engine, **data)


def _insert_language(language: str, engine: Engine):
    """insert language into language table"""
    data = {"language": language}
    _insert_table("language", engine, **data)


def _insert_publisher(
    name: str, parent_name: str, city_id: int, is_independent: bool, engine: Engine
):
    """insert publisher into publisher table"""
    data = {
        "name": name,
        "parent_name": parent_name,
        "city_id": city_id,
        "is_indepentent": is_independent,
    }
    _insert_table("publisher", engine, **data)


def _insert_book(
    title: str,
    author_list_id: int,
    language_id: int,
    translator_id: int,
    original_language_id: int,
    published_year: int,
    genre_id: int,
    subgenre_id: int,
    format_id: int,
    engine: Engine,
):
    """insert book into book table"""
    data = {
        "title": title,
        "author_list_id": author_list_id,
        "language_id": language_id,
        "translator_id": translator_id,
        "original_language_id": original_language_id,
        "published_year": published_year,
        "genre_id": genre_id,
        "subgenre_id": subgenre_id,
        "format_id": format_id,
    }
    _insert_table("book", engine, **data)


def _insert_reading_list(
    book_id: int,
    stopped_reading_date: date,
    is_read_completely: bool,
    purchase_location_type_id: int,
    bookstore_city_id: int,
    engine: Engine,
    bookstore_name: Optional[str] = None,
    website: Optional[str] = None,
):
    """insert into reading list"""
    data = {
        "book_id": book_id,
        "stopped_reading_date": stopped_reading_date,
        "is_read_completely": is_read_completely,
        "purchase_location_type_id": purchase_location_type_id,
        "bookstore_city_id": bookstore_city_id,
        "bookstore_name": bookstore_name,
        "website": website,
    }
    _insert_table("reading_list", engine, **data)


def setup_database(engine: Engine):
    """setup database using the engine"""

    # enums
    enums = [
        GenderEnum,
        GenreEnum,
        SubgenreEnum,
        FormatEnum,
        PurchaseLocationTypeEnum,
    ]
    for enum in enums:
        _create_enum_table(enum, engine)

    # dimensions
    dim_table_names = [
        "author",
        "author_list",
        "city",
        "website",
        "publisher",
        "language",
        "book",
    ]
    for dim_table_name in dim_table_names:
        _create_dim_table(dim_table_name, engine)

    # fact table
    _create_fact_table("reading_list", engine)


def insert_into_reading_list(
    title: str,
    authors: list[Author],
    language: str,
    original_language: str,
    published_year: int,
    genre: GenreEnum,
    subgenre: SubgenreEnum,
    book_format: FormatEnum,
    stopped_reading_date: date,
    is_read_completely: bool,
    purchase_location_type: PurchaseLocationTypeEnum,
    engine: Engine,
    translator: Optional[Author] = None,
    bookstore_name: Optional[str] = None,
    bookstore_city: Optional[str] = None,
    bookstore_region: Optional[str] = None,
    bookstore_country: Optional[str] = None,
    website: Optional[str] = None,
):
    """take raw values and insert into reading list and dimension tables"""
    author_ids: list[int] = []
    for i, author in enumerate(authors):
        try:
            author_id = _get_author_id(author.name, engine)
        except DimensionValueNotFoundError:
            _insert_author(
                name=author.name,
                birth_year=author.birth_year,
                gender_id=author.gender.value,
                engine=engine,
            )
            author_id = _get_author_id(author.name, engine)
        author_ids.append(author_id)

    author_list_id: int
    try:
        author_list_id = _get_author_list_id(author_ids, engine)
    except DimensionValueNotFoundError:
        _insert_author_list(author_ids, engine)
        author_list_id = _get_author_list_id(author_ids, engine)

    language_id: int
    try:
        language_id = _get_language_id(language, engine)
    except DimensionValueNotFoundError:
        _insert_language(language, engine)
        language_id = _get_language_id(language, engine)

    original_language_id: int
    try:
        original_language_id = _get_language_id(original_language, engine)
    except DimensionValueNotFoundError:
        _insert_language(language, engine)
        original_language_id = _get_language_id(original_language, engine)

    translator_id: int
    if translator is None:
        translator_id = 0
    else:
        try:
            translator_id = _get_author_id(translator.name, engine)
        except DimensionValueNotFoundError:
            _insert_author(
                translator.name, translator.birth_year, translator.gender.value, engine
            )
            translator_id = _get_author_id(translator.name, engine)

    book_id: int
    try:
        book_id = _get_book_id(title, author_list_id, engine)
    except DimensionValueNotFoundError:
        _insert_book(
            title=title,
            author_list_id=author_list_id,
            language_id=language_id,
            translator_id=translator_id,
            original_language_id=original_language_id,
            published_year=published_year,
            genre_id=genre.value,
            subgenre_id=subgenre.value,
            format_id=book_format.value,
            engine=engine,
        )
        book_id = _get_book_id(title, author_list_id, engine)

    bookstore_city_id = _get_city_id(
        city=bookstore_city, region=bookstore_region, country=bookstore_country
    )

    raise NotImplementedError
    _insert_reading_list(
        book_id=book_id,
        stopped_reading_date=stopped_reading_date,
        is_read_completely=is_read_completely,
        purchase_location_type_id=purchase_location_type.value,
        bookstore_city_id=bookstore_city_id,
        bookstore_name=bookstore_name,
        website=website,
    )