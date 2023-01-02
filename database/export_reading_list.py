#!/usr/bin/env python
"""export reading list"""

from argparse import ArgumentParser

from sqlalchemy import create_engine

from src.database import export_to_json

if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument("--path", "-p", type=str, help="the input database file")
    parser.add_argument(
        "--output_path", "-o", type=str, help="output database as json here"
    )
    args = parser.parse_args()

    engine = create_engine("sqlite:///" + args.path)
    export_to_json(engine, args.output_path)
