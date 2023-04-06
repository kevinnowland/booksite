from enum import Enum

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


# TODO: add essays
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
    THRILLER = 11


class FormatEnum(int, Enum):
    LONG = 1
    MEDIUM = 2
    MULTIPLE_SHORT = 3


class PurchaseLocationTypeEnum(int, Enum):
    WEBSITE = 1
    BOOKSTORE = 2
    ONLINE_BOOKSTORE = 3
    GIFT = 4
