from datetime import date
from enum import Enum
from typing import Optional, Union

from humps import camelize
from pydantic import BaseModel


class CamelModel(BaseModel):
    class Config:
        alias_generator = camelize
        allow_population_by_field_name = True


class GenreEnum(Enum):
    FANTASY = "fantasy"
    SHORT_STORY = "short story"
    SCI_FI = "sci fi"


class LocationTypeEnum(Enum):
    WEBSITE = "website"
    BOOSKTORE = "bookstore"
    ONLINE_BOOKSTORE = "bookstore (online)"


class Location(CamelModel):
    country: str
    region: str
    city: str


class PublisherInfo(CamelModel):
    name: str
    parent_name: str
    location: Location


class PurchaseInfo(CamelModel):
    date: date
    location_type: LocationTypeEnum
    location: Union[Location, str]


class GenderEnum(Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class AuthorInfo(CamelModel):
    name: str
    birth_year: Optional[int]
    gender: GenderEnum


class Book(CamelModel):
    title: str
    author_info: AuthorInfo
    language: str
    original_language: str
    published_year: int
    genres: list[GenreEnum]
    stopped_reading_date: Optional[date]
    completed: bool
    publisher_info: PublisherInfo
    purchase_info: PurchaseInfo


class Books(CamelModel):
    books: list[Book]
