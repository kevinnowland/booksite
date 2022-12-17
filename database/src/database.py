"""create the database schema

    the reading_list table is our fact table
    dimension tables are not manually curated
    enum tables are manually curated dimension tables
        and are prefixed with enum_
"""
from enum import EnumMeta
from typing import TypeVar

from sqlalchemy.engine.base import Engine

from .data_types import GenreEnum  # type: ignore
from .data_types import (FormatEnum, GenderEnum, PurchaseLocationTypeEnum,
                         SubGenreEnum)

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


def setup_database(engine: Engine):
    """setup database using the engine"""

    # enums
    _create_enum_table("gender", GenderEnum, engine)
    _create_enum_table("genre", GenreEnum, engine)
    _create_enum_table("subgenre", SubGenreEnum, engine)
    _create_enum_table("format", FormatEnum, engine)
    _create_enum_table("purchase_location_type", PurchaseLocationTypeEnum, engine)

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
