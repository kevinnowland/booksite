from datetime import date
from enum import Enum
from typing import Optional, Union

from humps import camelize
from pydantic import BaseModel


class GenreEnum(Enum):
    FANTASY = "fantasy"
    SHORT_STORY = "short story"
    SCI_FI = "sci fi"


class LocationTypeEnum(Enum):
    WEBSITE = "website"
    BOOSKTORE = "bookstore"
    ONLINE_BOOKSTORE = "bookstore (online)"


class Location(BaseModel):
    country: str
    region: str
    city: str


class PublisherInfo(BaseModel):
    name: str
    parent_name: str
    location: Location


class PurchaseInfo(BaseModel):
    date: date
    location_type: LocationTypeEnum
    location: Union[Location, str]


class Book(BaseModel):
    title: str
    author: str
    language: str
    original_language: str
    published_year: int
    genres: list[GenreEnum]
    stopped_reading_date: Optional[date]
    completed: bool
    publisher_info: PublisherInfo
    purchase_info: PurchaseInfo

    class Config:
        alias_generator = camelize
        allow_population_by_field_name = True


class Books(BaseModel):
    books: list[Book]
