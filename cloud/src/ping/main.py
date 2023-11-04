# pylint: disable=missing-function-docstring,missing-module-docstring,missing-class-docstring
from typing import TYPE_CHECKING
import functions_framework
from flask import Response

if TYPE_CHECKING:
    from flask import Request


@functions_framework.http
def main(_: "Request") -> "Response":
    return Response("pong", 200)
