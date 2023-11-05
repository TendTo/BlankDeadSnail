from dataclasses import dataclass
from typing import ClassVar
import json
from google.cloud import bigquery
import os
import requests
import cache


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
    def from_title_json(cls, title: str, n: int = 7) -> "str":
        if cached_result := cache.retrieve_from_cache(title):
            return cached_result
        movies = cls.from_title(title, n)
        result = json.dumps([movie.to_dict() for movie in movies])
        cache.store_in_cache(title, result)
        return result

    @classmethod
    def from_title(cls, title: str, n: int = 7) -> "list[Movie]":
        client = bigquery.Client(
            project=os.environ["PROJECT_ID"], location=os.environ["LOCATION"]
        )
        query = f"""
            SELECT *
            FROM (
                SELECT *, '1' as priority 
                FROM {cls.TABLE}
                WHERE REGEXP_CONTAINS(title, @regex)
                UNION ALL
                SELECT *, '2' as priority
                FROM {cls.TABLE}
                WHERE REGEXP_CONTAINS(title, @regex2)
            )
            ORDER BY priority
            LIMIT {n}
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(
                    "regex", "STRING", r"(?i:\b" + title + r"\b)"
                ),
                bigquery.ScalarQueryParameter(
                    "regex2", "STRING", r"(?i:\B" + title + r"\B)"
                ),
            ]
        )
        query_job = client.query(query, job_config=job_config)
        results = query_job.result()
        return cls.from_query(results)

    @classmethod
    def random_json(cls, n: int = 7) -> "list[Movie]":
        movies = cls.random(n)
        return json.dumps([movie.to_dict() for movie in movies])

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
    def _build_img(cls, movie_id: str, title: str) -> str:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}/images"
        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {os.environ['TMDB_TOKEN']}",
        }
        response = requests.get(url, headers=headers)
        placeholder = f"https://placehold.co/500x750/000000/ffffff?text={title}"
        if response.status_code != 200:
            return placeholder
        response = response.json()
        if "posters" in response and len(response["posters"]) > 0:
            return f"https://image.tmdb.org/t/p/original{response['posters'][0]['file_path']}"
        if "backdrops" in response and len(response["backdrops"]) > 0:
            return f"https://image.tmdb.org/t/p/original{response['backdrops'][0]['file_path']}"
        if "logos" in response and len(response["logos"]) > 0:
            return f"https://image.tmdb.org/t/p/original{response['logos'][0]['file_path']}"
        return placeholder

    @classmethod
    def from_row(cls, row: dict) -> "Movie":
        return cls(
            id=row.id or 0,
            overview=row.overview or "",
            poster_path=cls._build_img(row.id, row.title),
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

    @classmethod
    def from_json(cls, json_str: str):
        return cls(**json.loads(json_str))
