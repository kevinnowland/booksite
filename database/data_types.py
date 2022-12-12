from pydantic import BaseModel
from enum import Enum


class GenreEnum(Enum):
    FANTASY = "fantasy"
    SHORT_STORY = "short story"
    SCI_FI = "sci fi"


class Book(BaseModel):
    title: str
    author: str
    language: str
    original_language: str
    published_year: int
    genres: list[str]


class Books(BaseModel):
    books: list[Book]
