from datetime import date
from enum import Enum
from typing import Optional, Union

from humps import camelize
from pydantic import BaseModel


class CamelModel(BaseModel):
    class Config:
        alias_generator = camelize
        allow_population_by_field_name = True


class GenderEnum(int, Enum):
    FEMALE = 1
    MALE = 2
    NON_BINARY = 3


class GenreEnum(int, Enum):
    FICTION = 1
    NON_FICTION = 2
    POETRY = 3


class SubgenreEnum(int, Enum):
    LITERARY_FICTION = 1
    SCI_FI = 2
    FANTASY = 3
    HISTORICAL_FICTION = 4
    MEMOIR = 5
    BIOGRAPHY = 6
    HISTORY = 7
    TEXT_BOOK = 8
    POETRY = 9
    OTHER = 10


class FormatEnum(int, Enum):
    LONG = 1
    MEDIUM = 2
    MULTIPLE_SHORT = 3


class PurchaseLocationTypeEnum(int, Enum):
    WEBSITE = 1
    BOOKSTORE = 2
    ONLINE_BOOKSTORE = 3
    GIFT = 4


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
