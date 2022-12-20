#!/usr/bin/env python
from time import sleep
import sys
from argparse import ArgumentParser
from sqlalchemy import create_engine

from src.data_types import GenderEnum


def animated_print(text: str):
    """print a string one character at a time"""
    for c in text:
        sys.stdout.write(c)
        sys.stdout.flush()
        sleep(0.1)


def animated_input(text: str) -> str:
    """get input with animated text"""
    animated_print(text)
    return input(" ")


def get_raw_author_info() -> tuple[str, int, GenderEnum]:
    """get raw author info via animated prompts"""
    name = animated_input("Author name:")
    birth_year = int(animated_input("Author birth year:"))
    gender_raw = animated_input("Author gender (m/f/n):")

    if gender_raw == "m":
        gender = GenderEnum.MALE
    elif gender_raw == "f":
        gender = GenderEnum.FEMALE
    elif gender_raw == "n":
        gender = GenderEnum.NON_BINARY
    else:
        raise ValueError("gender must be one of 'm', 'f', or 'n'")
    return name, birth_year, gender


if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument("--path", "-p", type=str, help="the database file")
    args = parser.parse_args()

    engine = create_engine("sqlite:///" + args.path)

    print("let's add a book to the reading list!\n\n")
    title = animated_input("title:")
    print("\n")

    i = 0
    author_ids: list[int] = []
    while True:
        i + 1
        print(f"info for author {i}\n")
        get_raw_author_info()
        if animated_input("add another author? (y/N)") != "y":
            break
