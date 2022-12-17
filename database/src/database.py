"""create the database schema

    the reading_list table is our fact table
    dimension tables are not manually curated
    enum tables are manually curated dimension tables
        and are prefixed with enum_
"""
from enum import EnumMeta
from sqlite3 import IntegrityError
from typing import Any, TypeVar

from humps import decamelize
from sqlalchemy.engine.base import Engine

from .data_types import GenreEnum  # type: ignore
from .data_types import (Author, FormatEnum, GenderEnum,
                         PurchaseLocationTypeEnum, SubgenreEnum)

E = TypeVar("E", bound=EnumMeta)


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


def _insert_into_dim(
    table_name: str, uk_cols: list[str], engine: Engine, **data
) -> int:
    """attempt to insert into dimension table

    Assumes file `sql/table_name/inset_template.sql`
        exists

    Arguments:
        table_name (str): the table name
        uk_cols (list[str]): list of col names in the unique constraint
        engine (Engine): the engine to use
        data: the data to insert

    Returns:
        id of the entry
    """
    raw_sql = _import_sql(table_name, "insert_template")
    sql = raw_sql.format(**data)

    try:
        _execute(sql, engine)
    except IntegrityError:
        pass

    uk_vals = [data[c] for c in uk_cols]
    return _get_dim_id(table_name, uk_cols, uk_vals, engine)


def _insert_into_author(author: Author, engine: Engine) -> int:
    """insert an author into the author table and return its id"""
    data = {
        "name": author.name,
        "birth_year": author.birth_year,
        "gender_id": author.gender.value,
    }
    author_id = _insert_into_dim(
        table_name="author", uk_cols=["name"], engine=engine, **data
    )
    return author_id


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
