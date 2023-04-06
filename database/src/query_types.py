from datetime import date
from typing import Optional, TypedDict, Union

from .data_types import CamelModel


class RawPublisherCity(TypedDict):
    city_id: int
    name: str
    state: str
    publisher_name: str
    title: str


class IntPublisherCity(TypedDict):
    name: str
    state: str
    publishers: dict[str, list[str]]


class RawGenreCount(TypedDict):
    genre: str
    subgenre: str
    count: int


class RawLanguageCount(TypedDict):
    language: str
    original_language: str
    count: int


class City(CamelModel):
    country: str
    region: str
    city: str


class Publisher(CamelModel):
    name: str
    parent_name: str
    city: City
    is_independent: bool


class Bookstore(CamelModel):
    name: str
    city: City
    is_library: bool


class Website(CamelModel):
    website: str
    bookstore: Optional[Bookstore]


class Purchase(CamelModel):
    location_type: str
    location: Union[Bookstore, Website, None]


class Author(CamelModel):
    name: str
    birth_year: int
    gender: str


class Book(CamelModel):
    title: str
    authors: list[Author]
    language: str
    translator: Optional[Author]
    original_language: str
    published_year: int
    publisher: Publisher
    genre: str
    subgenre: str
    format: str


class ReadingListEntry(CamelModel):
    reading_list_id: int
    book: Book
    stopped_reading_date: date
    is_read_completely: bool
    purchase: Purchase
    rating: int


class ReadingList(CamelModel):
    entries: list[ReadingListEntry]


class PublisherTitles(CamelModel):
    name: str
    titles: list[str]


class PublisherCity(CamelModel):
    name: str
    state: str
    publishers: list[PublisherTitles]


class PublisherCityList(CamelModel):
    cities: list[PublisherCity]


class Subgenre(CamelModel):
    subgenre: str
    count: int


class Genre(CamelModel):
    genre: str
    subgenres: list[Subgenre]


class GenreCounts(CamelModel):
    genres: list[Genre]


class OriginalLanguage(CamelModel):
    original_language: str
    count: int


class Language(CamelModel):
    language: str
    original_languages: list[OriginalLanguage]


class LanguageCounts(CamelModel):
    languages: list[Language]
