"""create the database schema

    the reading_list table is our fact table
    dimension tables are not manually curated
    enum tables are manually curated dimension tables
        and are prefixed with enum_
"""
from datetime import date
from enum import EnumMeta
from typing import Any, TypeVar

from humps import decamelize
from sqlalchemy.engine.base import Engine

from .data_types import GenreEnum  # type: ignore
from .data_types import FormatEnum, GenderEnum, SubgenreEnum

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


def _get_dim_id(table_name: str, engine: Engine, **data) -> int:
    """get id of entry in dimension table

    Arguments:
        table_name (str): name of the table
        engine (Engine): the engine to use
        data: columns and values for columns for columns in a unique key

    Returns:
        id corresponding to the primary key
    """
    where = " AND ".join(f"{k} = {_munge_sql_val(v)}" for k, v in data.items())
    sql = f"""
    SELECT {table_name}_id
    FROM {table_name}
    WHERE {where};
    """
    results = engine.execute(sql).all()  # type: ignore

    if len(results) == 0:
        raise DimensionValueNotFoundError
    elif len(results) > 1:
        raise Exception("should only get one result back...")

    return results[0][0]


def _get_dim_values(
    table_name: str, cols: list[str], engine: Engine, **data
) -> dict[str, Any]:
    """get row by unique values in dimension table

    Arguments:
        table_name (str): name of the table
        cols: list[str]: the columns to return
        engine (Engine): the engine to use
        data: columns and values for columns for columns in a unique key

    Returns:
        dict mapping the column name to the returned value
    """
    columns = ", ".join(cols)
    where = " AND ".join(f"{k} = {_munge_sql_val(v)}" for k, v in data.items())
    sql = f"""
    SELECT {columns}
    FROM {table_name}
    WHERE {where};
    """
    results = engine.execute(sql).all()  # type: ignore

    if len(results) == 0:
        raise DimensionValueNotFoundError
    elif len(results) > 1:
        raise Exception("should only get one result back...")

    row = results[0]
    return {cols[i]: row[i] for i in range(len(cols))}


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


def insert_author(name: str, birth_year: int, gender_id: int, engine: Engine):
    """insert an author into the author table"""
    data = {
        "name": name,
        "birth_year": birth_year,
        "gender_id": gender_id,
    }
    _insert_table(table_name="author", engine=engine, **data)


def insert_author_list(author_ids: list[int], engine: Engine):
    """insert list of author ids into author list"""
    data = {"author_list": author_ids}
    _insert_table("author_list", engine, **data)


def insert_city(city: str, region: str, country: str, engine: Engine):
    """insert city into city table"""
    data = {
        "city": city,
        "region": region,
        "country": country,
    }
    _insert_table("city", engine, **data)


def insert_website(website: str, engine: Engine):
    """insert website into website table"""
    data = {"website": website}
    _insert_table("website", engine, **data)


def insert_language(language: str, engine: Engine):
    """insert language into language table"""
    data = {"language": language}
    _insert_table("language", engine, **data)


def insert_publisher(
    name: str, parent_name: str, city_id: int, is_independent: bool, engine: Engine
):
    """insert publisher into publisher table"""
    data = {
        "name": name,
        "parent_name": parent_name,
        "city_id": city_id,
        "is_independent": is_independent,
    }
    _insert_table("publisher", engine, **data)


def insert_book(
    title: str,
    author_list_id: int,
    publisher_id: int,
    published_year: int,
    language_id: int,
    translator_id: int,
    original_language_id: int,
    genre_id: int,
    subgenre_id: int,
    format_id: int,
    engine: Engine,
):
    """insert book into book table"""
    data = {
        "title": title,
        "author_list_id": author_list_id,
        "publisher_id": publisher_id,
        "published_year": published_year,
        "language_id": language_id,
        "translator_id": translator_id,
        "original_language_id": original_language_id,
        "genre_id": genre_id,
        "subgenre_id": subgenre_id,
        "format_id": format_id,
    }
    _insert_table("book", engine, **data)


def insert_bookstore(name: str, city_id: int, engine: Engine):
    """insert bookstore into bookstore table"""
    data = {
        "name": name,
        "city_id": city_id,
    }
    _insert_table("bookstore", engine, **data)


def insert_reading_list(
    book_id: int,
    stopped_reading_date: date,
    is_read_completely: bool,
    bookstore_id: int,
    website_id: int,
    engine: Engine,
):
    """insert into reading list"""
    data = {
        "book_id": book_id,
        "stopped_reading_date": stopped_reading_date,
        "is_read_completely": is_read_completely,
        "bookstore_id": bookstore_id,
        "website_id": website_id,
    }
    _insert_table("reading_list", engine, **data)


def get_author_id(name: str, engine: Engine) -> int:
    data = {"name": name}
    return _get_dim_id("author", engine, **data)


def get_author(name: str, cols: list[str], engine: Engine) -> dict[str, Any]:
    data = {"name": name}
    return _get_dim_values("author", cols, engine, **data)


def get_author_list_id(author_ids: list[int], engine: Engine) -> int:
    data = {"author_list": author_ids}
    return _get_dim_id("author_list", engine, **data)


def get_city_id(city: str, region: str, country: str, engine: Engine) -> int:
    data = {
        "city": city,
        "region": region,
        "country": country,
    }
    return _get_dim_id("city", engine, **data)


def get_website_id(website: str, engine: Engine) -> int:
    data = {"website": website}
    return _get_dim_id("website", engine, **data)


def get_language_id(language: str, engine: Engine) -> int:
    data = {"language": language}
    return _get_dim_id("language", engine, **data)


def get_publisher_id(name: str, parent_name: str, engine: Engine) -> int:
    data = {"name": name, "parent_name": parent_name}
    return _get_dim_id("publisher", engine, **data)


def get_book_id(title: str, author_list_id: int, engine: Engine) -> int:
    data = {
        "title": title,
        "author_list_id": author_list_id,
    }
    return _get_dim_id("book", engine, **data)


def get_bookstore_id(name: str, engine: Engine) -> int:
    data = {"name": name}
    return _get_dim_id("bookstore", engine, **data)


def setup_database(engine: Engine):
    """setup database using the engine"""

    # enums
    enums = [
        GenderEnum,
        GenreEnum,
        SubgenreEnum,
        FormatEnum,
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
        "bookstore",
    ]
    for dim_table_name in dim_table_names:
        _create_dim_table(dim_table_name, engine)

    # fact table
    _create_fact_table("reading_list", engine)
