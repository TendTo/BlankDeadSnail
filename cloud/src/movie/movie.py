from dataclasses import dataclass
from typing import ClassVar
import json
from google.cloud import bigquery
import os


def dict_to_list(dict_list: dict[list, dict]) -> list[str]:
    if dict_list and "list" in dict_list:
        elements_dict = dict_list["list"]
        if isinstance(elements_dict, list):
            return [
                element["element"] for element in elements_dict if "element" in element
            ]
    return []


@dataclass
class Movie:
    TABLE: ClassVar[str] = "durhack-404022.movies.movies"
    id: int
    overview: str
    poster_path: str
    original_language: str
    adult: bool
    belongs_to_collection: list[str]
    genres: list[str]
    budget: int
    production_companies: list[str]
    title: str
    production_countries: list[str]
    release_date: str
    runtime: int
    tagline: str

    @classmethod
    def from_title(cls, title: str, n: int = 7) -> "Movie":
        client = bigquery.Client(
            project=os.environ["PROJECT_ID"], location=os.environ["LOCATION"]
        )
        query = f"""
            SELECT *
            FROM {cls.TABLE}
            WHERE REGEXP_CONTAINS(title, @regex)
            LIMIT {n}
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("regex", "STRING", r"(?i:\b" + title + r"\b)"),
            ]
        )
        query_job = client.query(query, job_config=job_config)
        results = query_job.result()
        return cls.from_query(results)

    @classmethod
    def random(cls, n: int = 7) -> "list[Movie]":
        client = bigquery.Client(
            project=os.environ["PROJECT_ID"], location=os.environ["LOCATION"]
        )
        query = f"""
            SELECT *, RAND() as r
            FROM {cls.TABLE}
            ORDER BY r
            LIMIT {n}
        """
        query_job = client.query(query)
        results = query_job.result()
        return cls.from_query(results)

    @classmethod
    def from_row(cls, row: dict) -> "Movie":
        return cls(
            id=row.id or 0,
            overview=row.overview or "",
            poster_path=row.poster_path or "",
            original_language=row.original_language or "",
            adult=row.adult or False,
            belongs_to_collection=dict_to_list(row.belongs_to_collection),
            genres=dict_to_list(row.genres),
            budget=row.budget or 0,
            production_companies=dict_to_list(row.production_companies),
            title=row.title or "",
            production_countries=dict_to_list(row.production_countries),
            release_date=row.release_date or "",
            runtime=row.runtime or 0,
            tagline=row.tagline or "",
        )

    @classmethod
    def from_query(cls, query: list[dict]) -> "list[Movie]":
        return [cls.from_row(row) for row in query]

    def to_dict(self):
        return {
            "id": self.id,
            "overview": self.overview,
            "poster_path": self.poster_path,
            "original_language": self.original_language,
            "adult": self.adult,
            "belongs_to_collection": self.belongs_to_collection,
            "genres": self.genres,
            "budget": self.budget,
            "production_companies": self.production_companies,
            "title": self.title,
            "production_countries": self.production_countries,
            "release_date": self.release_date,
            "runtime": self.runtime,
            "tagline": self.tagline,
        }

    def to_json(self):
        return json.dumps(self.to_dict())
