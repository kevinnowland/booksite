from typing import Any, Optional

from sqlalchemy.engine.base import Engine

from .data_types import GenderEnum, PurchaseLocationTypeEnum
from .database import _get_dim_values
from .query_types import (
    Author,
    Book,
    Bookstore,
    City,
    Genre,
    GenreCounts,
    IntPublisherCity,
    Publisher,
    PublisherCity,
    PublisherCityList,
    PublisherTitles,
    Purchase,
    RawGenreCount,
    RawPublisherCity,
    ReadingList,
    ReadingListEntry,
    Subgenre,
    Website,
)


def _get_reading_list(engine: Engine) -> list[dict[str, Any]]:
    """get entire reading list data"""
    with open("sql/reading_list/get_reading_list.sql", "r") as f:
        sql = f.read()

    rows = engine.execute(sql).all()  # type: ignore

    return [
        {
            "reading_list_id": row[0],
            "title": row[1],
            "author_list": [int(i) for i in row[2].split(",")],
            "published_year": int(row[3]),
            "publisher_name": row[4],
            "publisher_parent_name": row[5],
            "publisher_city": row[6],
            "publisher_region": row[7],
            "publisher_country": row[8],
            "is_independent": int(row[9]) == 1,
            "language": row[10],
            "original_language": row[11],
            "translator_name": row[12],
            "translator_birth_year": row[13],
            "translator_gender": row[14],
            "genre": row[15],
            "subgenre": row[16],
            "format": row[17],
            "stopped_reading_date": row[18],
            "is_read_completely": int(row[19]) == 1,
            "was_gift": int(row[20]) == 1,
            "website": row[21],
            "bookstore_name": row[22],
            "bookstore_city": row[23],
            "bookstore_region": row[24],
            "bookstore_country": row[25],
            "bookstore_is_library": row[26],
            "rating": row[27],
        }
        for row in rows
    ]


def _parse_raw_reading_list(
    raw_reading_list: list[dict], engine: Engine
) -> ReadingList:
    """parse the raw reading list into a list of readinglistentry"""
    raw_reading_list = _get_reading_list(engine)
    entries: list[ReadingListEntry] = []
    for row in raw_reading_list:

        authors: list[Author] = []
        for author_id in row["author_list"]:
            author_info = _get_dim_values(
                "author",
                ["name", "birth_year", "gender_id"],
                engine,
                author_id=author_id,
            )
            authors.append(
                Author(
                    name=author_info["name"],
                    birth_year=int(author_info["birth_year"]),
                    gender=GenderEnum._value2member_map_[
                        int(author_info["gender_id"])
                    ].name,
                )
            )

        translator: Optional[Author] = None
        if row["translator_name"] != "":
            translator = Author(
                name=row["translator_name"],
                birth_year=row["translator_birth_year"],
                gender=row["translator_gender"],
            )

        if row["was_gift"]:
            purchase = Purchase(
                location_type=PurchaseLocationTypeEnum.GIFT.name, location=None
            )
        else:
            bookstore: Optional[Bookstore] = None
            if row["bookstore_name"] != "":
                bookstore = Bookstore(
                    name=row["bookstore_name"],
                    city=City(
                        city=row["bookstore_city"],
                        region=row["bookstore_region"],
                        country=row["bookstore_country"],
                    ),
                    is_library=row["bookstore_is_library"],
                )
            if row["website"] != "":
                website = Website(website=row["website"], bookstore=bookstore)

                if website.bookstore is not None:
                    purchase_location_type = (
                        PurchaseLocationTypeEnum.ONLINE_BOOKSTORE.name
                    )
                else:
                    purchase_location_type = PurchaseLocationTypeEnum.WEBSITE.name

                purchase = Purchase(
                    location_type=purchase_location_type, location=website
                )
            else:
                purchase = Purchase(
                    location_type=PurchaseLocationTypeEnum.BOOKSTORE.name,
                    location=bookstore,
                )

        entries.append(
            ReadingListEntry(
                reading_list_id=row["reading_list_id"],
                book=Book(
                    title=row["title"],
                    authors=authors,
                    translator=translator,
                    language=row["language"],
                    original_language=row["original_language"],
                    published_year=row["published_year"],
                    publisher=Publisher(
                        name=row["publisher_name"],
                        parent_name=row["publisher_parent_name"],
                        city=City(
                            city=row["publisher_city"],
                            region=row["publisher_region"],
                            country=row["publisher_country"],
                        ),
                        is_independent=row["is_independent"],
                    ),
                    genre=row["genre"],
                    subgenre=row["subgenre"],
                    format=row["format"],
                ),
                stopped_reading_date=row["stopped_reading_date"],
                is_read_completely=row["is_read_completely"],
                purchase=purchase,
                rating=row["rating"],
            )
        )

    return ReadingList(entries=entries)


def export_reading_list(engine: Engine, output_file: str):
    """export reading list"""
    raw_reading_list = _get_reading_list(engine)
    reading_list = _parse_raw_reading_list(raw_reading_list, engine)

    with open(output_file, "w") as f:
        f.write(reading_list.json(by_alias=True))


def _get_raw_publisher_cities(engine: Engine) -> list[RawPublisherCity]:
    """execute sql query to get list of book titles and their cities"""
    with open("sql/misc/get_publisher_cities.sql", "r") as f:
        sql = f.read()

    rows = engine.execute(sql).all()  # type: ignore
    return [
        {
            "city_id": int(row[0]),
            "name": row[1],
            "state": row[2],
            "publisher_name": row[3],
            "title": row[4],
        }
        for row in rows
    ]


def _parse_publisher_cities(
    raw_publisher_cities: list[RawPublisherCity],
) -> PublisherCityList:
    cities: dict[int, IntPublisherCity] = dict()
    for raw in raw_publisher_cities:
        if c := cities.get(raw["city_id"]):
            if t := c["publishers"].get(raw["publisher_name"]):
                t.append(raw["title"])
            else:
                c["publishers"][raw["publisher_name"]] = [raw["title"]]
        else:
            cities[raw["city_id"]] = {
                "name": raw["name"],
                "state": raw["state"],
                "publishers": {raw["publisher_name"]: [raw["title"]]},
            }

    return PublisherCityList(
        cities=[
            PublisherCity(
                name=ic["name"],
                state=ic["state"],
                publishers=[
                    PublisherTitles(
                        name=publisher_name,
                        titles=titles,
                    )
                    for publisher_name, titles in ic["publishers"].items()
                ],
            )
            for ic in cities.values()
        ]
    )


def export_publisher_cities(engine: Engine, output_file: str):
    raw_publisher_cities = _get_raw_publisher_cities(engine)
    publisher_cities = _parse_publisher_cities(raw_publisher_cities)

    with open(output_file, "w") as f:
        f.write(publisher_cities.json(by_alias=True))


def _get_raw_genre_counts(engine: Engine) -> list[RawGenreCount]:
    """execute sql query to get counts by genre"""
    with open("sql/misc/get_genre_counts.sql", "r") as f:
        sql = f.read()

    rows = engine.execute(sql).all()  # type: ignore
    return [
        {
            "genre": row[0],
            "subgenre": row[1],
            "count": int(row[2]),
        }
        for row in rows
    ]


def _parse_raw_genre_counts(raw: list[RawGenreCount]) -> GenreCounts:
    genres: dict[str, Genre] = {}
    for r in raw:
        sg = Subgenre(subgenre=r["subgenre"], count=r["count"])
        if g := genres.get(r["genre"]):
            g.subgenres.append(sg)
        else:
            genres[r["genre"]] = Genre(genre=r["genre"], subgenres=[sg])

    return GenreCounts(genres=list(genres.values()))


def export_genre_counts(engine: Engine, output_file: str):
    raw_genre_counts = _get_raw_genre_counts(engine)
    genre_counts = _parse_raw_genre_counts(raw_genre_counts)

    with open(output_file, "w") as f:
        f.write(genre_counts.json(by_alias=True))
