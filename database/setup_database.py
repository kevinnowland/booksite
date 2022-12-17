#!/usr/bin/env python
""" run the initial setup of the database"""
from argparse import ArgumentParser
from sqlalchemy import create_engine

from src.database import setup_database

if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument("--path", "-p", type=str, help="the database file")
    args = parser.parse_args()

    engine = create_engine("sqlite:///" + args.path)
    setup_database(engine)
