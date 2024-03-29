#!/usr/bin/env python
"""export reading list"""

from argparse import ArgumentParser

from sqlalchemy import create_engine
from src.queries import (
    export_genre_counts,
    export_language_counts,
    export_publisher_cities,
    export_publisher_counts,
    export_reading_list,
)

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
    export_reading_list(
        engine=engine, output_file=args.output_directory + "/readingList.json"
    )
    export_publisher_cities(
        engine=engine, output_file=args.output_directory + "/publisherCities.json"
    )
    export_genre_counts(
        engine=engine, output_file=args.output_directory + "/genreCounts.json"
    )
    export_language_counts(
        engine=engine, output_file=args.output_directory + "/languageCounts.json"
    )
    export_publisher_counts(
        engine=engine, output_file=args.output_directory + "/publisherCounts.json"
    )
