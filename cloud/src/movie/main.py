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

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
}


@functions_framework.errorhandler(KeyError)
def key_error(e: "KeyError") -> "Response":
    return Response(f"The key {e} was not found.", 500, headers=HEADERS)


@functions_framework.errorhandler(AttributeError)
def attribute_error(e: "AttributeError") -> "Response":
    return Response(f"The attribute {e} was not found.", 500, headers=HEADERS)


@functions_framework.errorhandler(ValueError)
def value_error(e: "ValueError") -> "Response":
    return Response(
        f"The value provided was not the correct type: {e}.", 400, headers=HEADERS
    )


def get(req: "Request") -> "Response":
    path = req.path
    # if re.match(r"^/all$", path):
    # if prod_id := re.match(r"^/\d+$", path):
    if re.match(r"^/random$", path):
        seed = req.args.get("seed", "0")
        n = int(req.args.get("n", 7))
        return Response(
            Movie.random_json(seed, n),
            200,
            headers=HEADERS,
        )
    if re.match(r"^/", path):
        n = int(req.args.get("n", 7))
        title = req.args.get("title", None)
        if title is None:
            return Response("missing title", 400, headers=HEADERS)
        return Response(Movie.from_title_json(title, n), 200, headers=HEADERS)

    return Response("unsupported path", 400, headers=HEADERS)


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
    return Response("unsupported method", 400, headers=HEADERS)


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
