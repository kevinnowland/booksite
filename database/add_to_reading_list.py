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
                          get_bookstore_id, get_cities, get_city_id,
                          get_language_id, get_publisher_id, get_website_id,
                          insert_author, insert_author_list, insert_book,
                          insert_bookstore, insert_city, insert_language,
                          insert_publisher, insert_reading_list,
                          insert_website)


VALID_READING_LANGUAGES = [
    "English",
    "French",
    "Spanish",
]


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
        prompt = f"do you mean {name} - {birth_year} - {gender.name}?"
        if confirm_prompt(prompt):
            return name, birth_year, gender  # type: ignore
        else:
            animated_print(f"okay, will continue asking about {writer_type}")
    except DimensionValueNotFoundError:
        birth_year = int(animated_input(f"{writer_type} birth year:"))
        gender_id = prompt_enum_id(GenderEnum, f"what is the {writer_type}'s gender?")
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
        i = i + 1
        print(f"\ninfo for author {i}")
        author_id = prompt_author_id(is_translator=False, engine=engine)
        author_ids.append(author_id)

        if not confirm_prompt("add another author?"):
            break

    if len(author_ids) == 0:
        raise Exception(f"must have at least one author! {author_ids}")

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
    city = animated_input("city:")

    try:
        cities = get_cities(city, engine)
        for i, info in enumerate(cities):
            print(f"{i} - {info['city']}, {info['region']} {info['country']}")
        index = animated_input("if matching city, enter index:")
        try:
            info = cities[int(index)]
            region = info["region"]
            country = info["country"]
        except ValueError:
            animated_print(f"will continue asking for info about {city}")
    except DimensionValueNotFoundError:
        region = animated_input("region/state/province:")
        country = animated_input("country:")

    try:
        city_id = get_city_id(city, region, country, engine)
    except DimensionValueNotFoundError:
        insert_city(city, region, country, engine)
        city_id = get_city_id(city, region, country, engine)

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
        animated_print("where is the publisher located?\n")
        city_id = prompt_city_id(engine)
        is_independent = confirm_prompt("is publisher independent?")
        insert_publisher(name, parent_name, city_id, is_independent, engine)
        publisher_id = get_publisher_id(name, parent_name, engine)

    return publisher_id


def prompt_language_id(
    prompt: str, engine: Engine, valid_languages: Optional[list[str]] = None
) -> int:
    """Get language id"""
    while True:
        language = animated_input(prompt)
        language = language.lower().capitalize()

        if valid_languages:
            if language not in valid_languages:
                print(
                    f"language not recognized from list of valid languages: {valid_languages}"  # noqa: E501
                )

        try:
            language_id = get_language_id(language, engine)
            break
        except DimensionValueNotFoundError:
            if confirm_prompt(f"{language} not found in database. Add it?"):
                insert_language(language, engine)
                language_id = get_language_id(language, engine)
                break
            else:
                animated_print("I suppose we'll try again...\n")

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

    print("\n", end="")
    publisher_id = prompt_publisher_id(engine)

    print("\n", end="")
    translator_id = 0
    if confirm_prompt("does the book have a translator?"):
        translator_id = prompt_author_id(is_translator=True, engine=engine)

    print("\n", end="")
    prompt = "what was the primary language you READ the book in?"
    language_id = prompt_language_id(prompt, engine, VALID_READING_LANGUAGES)

    print("\n", end="")
    prompt = "what was the primary language the book was WRITTEN in?"
    original_language_id = prompt_language_id(prompt, engine)

    print("\n", end="")
    published_year = int(animated_input("what year was the book published?"))

    print("\n", end="")
    genre_id = prompt_enum_id(GenreEnum, "what genre is the book?")

    print("\n", end="")
    subgenre_id = prompt_enum_id(SubgenreEnum, "what subgenre is the book?")

    print("\n", end="")
    format_id = prompt_enum_id(FormatEnum, "what is the book's format?")

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
                "when did you stop reading the book? YYYY-MM-DD"
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
        animated_print("using existing bookstore")
    except DimensionValueNotFoundError:
        animated_print("where is the bookstore located?\n")
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


def prompt_rating() -> int:
    while True:
        raw_rating = animated_input("rating (0-5):")
        try:
            rating = int(raw_rating)
        except ValueError:
            print("rating must be an integer")

        if rating < 0 or rating > 5:
            print("rating must be 0-5")
        else:
            break
    return rating


if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument("--path", "-p", type=str, help="the database file")
    args = parser.parse_args()

    engine = create_engine("sqlite:///" + args.path)

    while True:

        print("\nLet's add a book to the reading list!\n")
        book_id = prompt_book_id(engine)

        print("\n", end="")
        stopped_reading_date = prompt_stopped_reading_date()
        is_read_completely = confirm_prompt("did you finish the book?")

        bookstore_id: int = 0
        website_id: int = 0
        was_gift = False

        print("\n", end="")
        if confirm_prompt("was the book a a gift?"):
            was_gift = True
        else:
            if confirm_prompt("was the book purchased online?"):
                website_id = prompt_website_id(engine)

                if confirm_prompt("is this website associated with a bookstore?"):
                    bookstore_id = prompt_bookstore_id(engine)
            else:
                animated_print("let's get info about the bookstore then\n")
                bookstore_id = prompt_bookstore_id(engine)

        print("\n", end="")
        rating = prompt_rating()

        insert_reading_list(
            book_id=book_id,
            stopped_reading_date=stopped_reading_date,
            is_read_completely=is_read_completely,
            was_gift=was_gift,
            bookstore_id=bookstore_id,
            website_id=website_id,
            rating=rating,
            engine=engine,
        )

        animated_print("book successfully added!\n")

        if not confirm_prompt("add another book?"):
            break

    animated_print("goodbye!\n")
