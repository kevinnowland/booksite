from datetime import date
from enum import Enum
from typing import Optional, Union

from humps import camelize
from pydantic import BaseModel


class CamelModel(BaseModel):
    class Config:
        alias_generator = camelize
        allow_population_by_field_name = True


class GenderEnum(Enum):
    FEMALE = 1
    MALE = 2
    NON_BINARY = 3


class GenreEnum(Enum):
    FICTION = 1
    NON_FICTION = 2
    POETRY = 3


class SubgenreEnum(Enum):
    SCI_FI = 1
    FANTASY = 2
    MEMOIR = 3
    BIOGRAPHY = 4
    HISTORY = 5
    HISTORICAL_FICTION = 6
    OTHER = 7
    TEXT_BOOK = 8


class FormatEnum(Enum):
    LONG = 1
    MEDIUM = 2
    MULTIPLE_SHORT = 3


class PurchaseLocationTypeEnum(Enum):
    WEBSITE = 1
    BOOSKTORE = 2
    ONLINE_BOOKSTORE = 3


class Location(CamelModel):
    country: str
    region: str
    city: str


class Publisher(CamelModel):
    name: str
    parent_name: str
    location: Location


class Purchase(CamelModel):
    date: date
    location_type: PurchaseLocationTypeEnum
    location: Union[Location, str]


class Author(CamelModel):
    name: str
    birth_year: Optional[int]
    gender: GenderEnum


class Book(CamelModel):
    title: str
    authors: list[Author]
    language: str
    translator: Optional[Author]
    original_language: str
    published_year: int
    genres: list[GenreEnum]
    publisher: Publisher


class ReadingListEntry(CamelModel):
    books: Book
    stopped_reading_date: Optional[date]
    completed: bool
    purchase: Purchase
