# pylint: disable=missing-function-docstring,missing-module-docstring,missing-class-docstring
from typing import TYPE_CHECKING
import functions_framework
from flask import Response
import os
import redis


if TYPE_CHECKING:
    from flask import Request


@functions_framework.http
def main(_: "Request") -> "Response":
    r = redis.Redis(
        host=os.environ["REDIS_HOST"],
        port=os.environ["REDIS_PORT"],
        credential_provider=os.environ["REDIS_PSW"],
    )
    return Response(str(r.ping()))
