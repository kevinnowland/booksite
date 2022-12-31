#!/usr/bin/env python
import sys
from argparse import ArgumentParser
from datetime import date
from enum import EnumMeta
from time import sleep
from typing import Optional, TypeVar

from sqlalchemy import create_engine
from sqlalchemy.engine.base import Engine

from src.data_types import FormatEnum, GenderEnum, GenreEnum, SubgenreEnum
from src.database import (DimensionValueNotFoundError, get_author,
                          get_author_id, get_author_list_id, get_book_id,
                          get_bookstore_id, get_city_id, get_language_id,
                          get_publisher_id, get_website_id, insert_author,
                          insert_author_list, insert_book, insert_bookstore,
                          insert_city, insert_language, insert_publisher,
                          insert_reading_list, insert_website)


def animated_print(text: str):
    """print a string one character at a time"""
    for c in text:
        sys.stdout.write(c)
        sys.stdout.flush()
        sleep(0.02)


def animated_input(text: str) -> str:
    """get input with animated text"""
    animated_print(text)
    return input(" ")


def confirm_prompt(prompt: str) -> bool:
    return animated_input(prompt + " y/N:").lower() == "y"


E = TypeVar("E", bound=EnumMeta)


def prompt_enum_id(enum: E, prompt: str) -> int:
    """get the id of a value in an enum

    NOTE: assumes all enum values are integers
    """
    _id: Optional[int] = None
    options_text = "\n" + "\n".join(f"{e.value} - {e.name}" for e in enum)  # type: ignore  # noqa: E501
    options_text += "\nenter number: "

    while _id not in enum._value2member_map_.keys():
        animated_print(prompt)
        try:
            _id = int(input(options_text))
        except ValueError:
            pass

    if type(_id) != int:
        raise Exception(f"something went wrong, _id not int: {type(_id)}")

    return _id


def prompt_raw_author_info(
    engine: Engine, is_translator: bool = False
) -> tuple[str, int, GenderEnum]:
    """get raw author info via animated prompts"""

    if is_translator:
        writer_type = "translator"
    else:
        writer_type = "author"
    name = animated_input(f"{writer_type} name:")

    try:
        author_info = get_author(name, ["name", "birth_year", "gender_id"], engine)
        name = author_info["name"]
        birth_year = author_info["birth_year"]
        gender = GenderEnum._value2member_map_[author_info["gender_id"]]
        prompt = f"Do you mean {name} - {birth_year} - {gender.name}?"
        if confirm_prompt(prompt):
            return name, birth_year, gender  # type: ignore
        else:
            animated_print(f"okay, will continue asking about {writer_type}")
    except DimensionValueNotFoundError:
        birth_year = int(animated_input(f"{writer_type} birth year:"))
        gender_id = prompt_enum_id(GenderEnum, f"What is the {writer_type}'s gender?")
        gender = GenderEnum._value2member_map_[gender_id]

    return name, birth_year, gender  # type: ignore


def prompt_author_id(engine: Engine, is_translator: bool = False) -> int:
    """get author id via prompt"""
    name, birth_year, gender = prompt_raw_author_info(
        is_translator=is_translator, engine=engine
    )

    try:
        author_id = get_author_id(name, engine)
    except DimensionValueNotFoundError:
        insert_author(
            name=name,
            birth_year=birth_year,
            gender_id=gender.value,
            engine=engine,
        )
        author_id = get_author_id(name, engine)

    return author_id


def prompt_author_ids(engine: Engine) -> list[int]:
    """get author ids via prompts"""
    i = 0
    author_ids: list[int] = []

    while True:
        i + 1
        print(f"info for author {i}\n")
        author_id = prompt_author_id(is_translator=False, engine=engine)
        author_ids.append(author_id)

        if not confirm_prompt("add another author?"):
            break

    if len(author_ids) == 0:
        raise Exception(f"must have more at least one author! {author_ids}")

    return author_ids


def prompt_author_list_id(engine: Engine) -> int:
    """get author list id via prompts"""
    author_ids = prompt_author_ids(engine)

    try:
        author_list_id = get_author_list_id(author_ids, engine)
    except DimensionValueNotFoundError:
        insert_author_list(author_ids, engine)
        author_list_id = get_author_list_id(author_ids, engine)

    return author_list_id


def prompt_city_id(engine: Engine) -> int:
    """get city id via prompt"""
    city = animated_input("City:")
    region = animated_input("Region/State/Province:")
    country = animated_input("Country:")

    try:
        city_id = get_city_id(city, region, country, engine)
    except DimensionValueNotFoundError:
        insert_city(city, country, region, engine)
        city_id = get_city_id(city, country, region, engine)

    return city_id


def prompt_publisher_id(engine: Engine) -> int:
    """get publisher via prompt"""
    name = animated_input("publisher name:")
    parent_name = animated_input("publisher parent name:")

    try:
        publisher_id = get_publisher_id(name, parent_name, engine)
        animated_print("existing publisher found")
        return publisher_id
    except DimensionValueNotFoundError:
        animated_print("Where is the publisher located?\n")
        city_id = prompt_city_id(engine)
        is_independent = confirm_prompt("Is publisher independent?")
        insert_publisher(name, parent_name, city_id, is_independent, engine)
        publisher_id = get_publisher_id(name, parent_name, engine)

    return publisher_id


def prompt_language_id(prompt: str, engine: Engine) -> int:
    """Get language id"""
    language = animated_input(prompt)
    language = language.lower()

    try:
        language_id = get_language_id(language, engine)
    except DimensionValueNotFoundError:
        insert_language(language, engine)
        language_id = get_language_id(language, engine)

    return language_id


def prompt_book_id(engine: Engine) -> int:
    """get book id"""
    title = animated_input("title:")

    author_list_id = prompt_author_list_id(engine)

    try:
        book_id = get_book_id(title, author_list_id, engine)
        print("\n")
        animated_print("book already exists!")
        if confirm_prompt("want to use existing book?"):
            return book_id
        else:
            animated_print("then try again")
            sys.exit()

    except DimensionValueNotFoundError:
        pass

    print("\n")
    publisher_id = prompt_publisher_id(engine)

    print("\n")
    translator_id = 0
    if confirm_prompt("does the book have a translator?"):
        translator_id = prompt_author_id(is_translator=True, engine=engine)

    print("\n")
    prompt = "What was the primary language you READ the book?"
    language_id = prompt_language_id(prompt, engine)

    print("\n")
    prompt = "What was the primary language the book was WRITTEN in?"
    original_language_id = prompt_language_id(prompt, engine)

    print("\n")
    published_year = int(animated_input("What year was the book published?"))

    print("\n")
    genre_id = prompt_enum_id(GenreEnum, "What genre is the book?")

    print("\n")
    subgenre_id = prompt_enum_id(SubgenreEnum, "What subgenre is the book?")

    print("\n")
    format_id = prompt_enum_id(FormatEnum, "What is the book's format?")

    insert_book(
        title=title,
        author_list_id=author_list_id,
        publisher_id=publisher_id,
        published_year=published_year,
        language_id=language_id,
        translator_id=translator_id,
        original_language_id=original_language_id,
        genre_id=genre_id,
        subgenre_id=subgenre_id,
        format_id=format_id,
        engine=engine,
    )
    book_id = get_book_id(title, author_list_id, engine)

    return book_id


def prompt_stopped_reading_date() -> date:
    """get stopped reading date"""
    while True:
        try:
            date_string = animated_input(
                "When did you stop reading the book? YYYY-MM-DD"
            )
            stopped_reading_date = date.fromisoformat(date_string)
            break
        except ValueError:
            print("invalid date")
            pass

    return stopped_reading_date


def prompt_bookstore_id(engine: Engine) -> int:
    """get bookstore id via prompt"""
    name = animated_input("enter bookstore name:")

    try:
        bookstore_id = get_bookstore_id(name, engine)
    except DimensionValueNotFoundError:
        pass

    animated_print("Where is the bookstore located?\n")
    city_id = prompt_city_id(engine)

    insert_bookstore(name, city_id, engine)
    bookstore_id = get_bookstore_id(name, engine)
    return bookstore_id


def clean_website(website: str) -> str:
    """clean website

    e.g., https://www.indiebound.com -> indiebound.com
    """
    if "https://" == website[:8]:
        website = website[8:]
    if "www." == website[:4]:
        website = website[4:]
    if "/" in website:
        website = website.split("/")[0]
    return website


def prompt_website_id(engine: Engine) -> int:
    """get website id via prompt"""
    raw_website = animated_input("enter website:")
    website = clean_website(raw_website)

    try:
        website_id = get_website_id(website, engine)
    except DimensionValueNotFoundError:
        website_id = insert_website(website, engine)

    return website_id


if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument("--path", "-p", type=str, help="the database file")
    args = parser.parse_args()

    engine = create_engine("sqlite:///" + args.path)

    print("\nLet's add a book to the reading list!\n")
    book_id = prompt_book_id(engine)
    stopped_reading_date = prompt_stopped_reading_date()
    is_read_completely = confirm_prompt("Did you finish the book?")

    bookstore_id: int = 0
    website_id: int = 0

    if confirm_prompt("Was the book purchased online?"):
        website_id = prompt_website_id(engine)

        if confirm_prompt("Is this website associated with a bookstore?"):
            bookstore_id = prompt_bookstore_id(engine)
    else:
        bookstore_id = prompt_bookstore_id(engine)

    insert_reading_list(
        book_id=book_id,
        stopped_reading_date=stopped_reading_date,
        is_read_completely=is_read_completely,
        bookstore_id=bookstore_id,
        website_id=website_id,
        engine=engine,
    )
