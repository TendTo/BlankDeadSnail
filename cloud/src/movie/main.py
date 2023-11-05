# pylint: disable=missing-function-docstring,missing-module-docstring,missing-class-docstring
from typing import TYPE_CHECKING
import functions_framework
from flask import Response
import os
import redis
from google.cloud import bigquery
import re
from movie import Movie
import json

if TYPE_CHECKING:
    from flask import Request


@functions_framework.errorhandler(KeyError)
def key_error(e: "KeyError") -> "Response":
    return Response(f"The key {e} was not found.", 500)


@functions_framework.errorhandler(AttributeError)
def attribute_error(e: "AttributeError") -> "Response":
    return Response(f"The attribute {e} was not found.", 500)


@functions_framework.errorhandler(ValueError)
def value_error(e: "ValueError") -> "Response":
    return Response(f"The value provided was not the correct type: {e}.", 400)


def from_movies_to_response(movies: "list[Movie]") -> "Response":
    return Response(
        json.dumps([movie.to_dict() for movie in movies]),
        200,
        headers={"Content-Type": "application/json"},
    )


def get(req: "Request") -> "Response":
    path = req.path
    # if re.match(r"^/all$", path):
    # if prod_id := re.match(r"^/\d+$", path):
    if re.match(r"^/random$", path):
        n = int(req.args.get("n", 7))
        movies = Movie.random(n)
        return from_movies_to_response(movies)
    if re.match(r"^/", path):
        n = int(req.args.get("n", 7))
        title = req.args.get("title", None)
        if title is None:
            return Response("missing title", 400)
        movies = Movie.from_title(title, n)
        return from_movies_to_response(movies)

    return Response("unsupported path", 400)


def post(req: "Request") -> str:
    return req


def put(req: "Request") -> str:
    return req


def delete(req: "Request") -> str:
    return req


@functions_framework.http
def main(req: "Request") -> "Response":
    # return redis_call()
    if req.method == "GET":
        return get(req)
    if req.method == "POST":
        return post(req)
    if req.method == "PUT":
        return put(req)
    if req.method == "DELETE":
        return delete(req)
    return Response("unsupported method", 400)


def bq_call():
    client = bigquery.Client(
        project=os.environ["PROJECT_ID"], location=os.environ["LOCATION"]
    )
    query = """
        SELECT title
        FROM `durhack-404022.movies.movies`
        WHERE title LIKE '%Star Wars%'
        LIMIT 100
    """
    query_job = client.query(query)
    results = query_job.result()  # Waits for job to complete.
    return [row.title for row in results]


def redis_call():
    creds_provider = redis.UsernamePasswordCredentialProvider(
        "backend", os.environ["REDIS_PSW"]
    )
    user_connection = redis.Redis(
        host=os.environ["REDIS_HOST"],
        port=os.environ["REDIS_PORT"],
        credential_provider=creds_provider,
    )
    print(user_connection.ping())
    return user_connection.ping()
