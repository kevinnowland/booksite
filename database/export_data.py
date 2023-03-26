#!/usr/bin/env python
"""export reading list"""

from argparse import ArgumentParser

from sqlalchemy import create_engine
from src.database import export_reading_list

if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument(
        "--path",
        "-p",
        type=str,
        help="the input database file",
        default="data/production.db",
    )
    parser.add_argument(
        "--output_directory",
        "-o",
        type=str,
        help="output database as json here",
        default="../web/src/data",
    )
    args = parser.parse_args()

    engine = create_engine("sqlite:///" + args.path)
    export_reading_list(engine, args.output_directory + "/reading_list.json")
