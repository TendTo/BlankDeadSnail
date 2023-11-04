# pylint: disable=missing-function-docstring,missing-module-docstring,missing-class-docstring
from typing import TYPE_CHECKING
import functions_framework
from flask import Response
from product import Product
import re
import os
import redis
import requests


if TYPE_CHECKING:
    from flask import Request


@functions_framework.errorhandler(KeyError)
def key_error(e: "KeyError") -> "Response":
    return Response(f"The key {e} was not found.", 500)


@functions_framework.errorhandler(AttributeError)
def attribute_error(e: "AttributeError") -> "Response":
    return Response(f"The attribute {e} was not found.", 500)


def get(req: "Request") -> str:
    path = req.path
    if re.match(r"^/random$", path):
        return Response(Product.generate_random().to_json(), 200)
    if re.match(r"^/all$", path):
        return "all"
        return Response(Product.generate_random().to_json(), 200)
    if re.match(r"^/\d+$", path):
        return "id"
        return Response(Product.generate_random().to_json(), 200)
    if re.match(r"^/", path):
        return "root"
        return Response(Product.generate_random().to_json(), 200)
    return "unsupported path"
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
    return Response(str(os.environ))
    if req.method == "GET":
        return get(req)
    if req.method == "POST":
        return post(req)
    if req.method == "PUT":
        return put(req)
    if req.method == "DELETE":
        return delete(req)
    return Response("unsupported method", 400)


def redis_call():
    creds_provider = redis.UsernamePasswordCredentialProvider(
        "default", os.environ["REDIS_PSW"]
    )
    user_connection = redis.Redis(
        host=os.environ["REDIS_HOST"],
        port=os.environ["REDIS_PORT"],
        credential_provider=creds_provider,
    )
    print(user_connection.ping())
    return user_connection.ping()
