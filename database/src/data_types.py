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
    FEMALE = "female"
    MALE = "male"
    NON_BINARY = "non binary"


class GenreEnum(Enum):
    FICTION = "fiction"
    NON_FICTION = "non-fiction"
    POETRY = "poetry"


class SubgenreEnum(Enum):
    SCI_FI = "sci fi"
    FANTASY = "fantasy"
    MEMOIR = "memoir"
    BIOGRAPHY = "biography"
    HISTORY = "history"
    HISTORICAL_FICTION = "historical fiction"
    OTHER = "other"
    TEXT_BOOK = "text book"


class FormatEnum(Enum):
    LONG = "long"
    MEDIUM = "medium"
    MULTIPLE_SHORT = "multiple short"


class PurchaseLocationTypeEnum(Enum):
    WEBSITE = "website"
    BOOSKTORE = "bookstore"
    ONLINE_BOOKSTORE = "bookstore (online)"


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
