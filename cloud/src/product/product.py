# pylint: disable=missing-function-docstring,missing-module-docstring,missing-class-docstring
from typing import TYPE_CHECKING
from dataclasses import dataclass
import os
import asyncio
import aiohttp
import json

if TYPE_CHECKING:
    from amz_product import ProductApiResponse
    from amz_search import SearchApiResponse, SearchResult

CACHE: "dict[int, Product]" = {}


@dataclass
class Product:
    id: "int"
    title: "str"
    price: "float"
    description: "str"
    category: "str"
    image: "str | bytes"

    def to_json(self) -> "str":
        return json.dumps(self.__dict__)

    @classmethod
    async def search(cls, search_term: "str") -> "tuple[Product]":
        async with aiohttp.ClientSession() as session:
            search_results: "SearchApiResponse" = await cls._search_request(
                session, search_term
            )
            return await cls._search_results(session, search_results)

    @staticmethod
    async def _search_request(
        session: "aiohttp.ClientSession", search_term: "str"
    ) -> "SearchApiResponse":
        params = {
            "api_key": os.environ["RAINFOREST_API_KEY"],
            "type": "search",
            "amazon_domain": "amazon.co.uk",
            "search_term": search_term,
            "language": "en_GB",
            "currency": "gbp",
            "max_page": "1",
        }
        resp = await session.get(
            url="https://api.rainforestapi.com/request", params=params
        )
        return await resp.json()

    @classmethod
    async def _search_results(
        cls, session: "aiohttp.ClientSession", api_result: "SearchApiResponse"
    ) -> "tuple[Product]":
        products: "list[Product]" = []
        tasks = []
        # before going to the api, check the cache
        for search_result in api_result.searchresults:
            if search_result.asin in CACHE:
                tasks.append(CACHE[search_result.asin])
            else:
                # tasks.append(cls._product_request(session, search_result.asin))
                tasks.append(cls._product_request(session, search_result.asin))
        products.extend(await asyncio.gather(*tasks))
        for product in products:
            CACHE[product.id] = product
        return products

    @classmethod
    async def _product_request(
        cls, session: "aiohttp.ClientSession", search_result: "SearchResult"
    ) -> "Product":
        params = {
            "api_key": os.environ["RAINFOREST_API_KEY"],
            "type": "product",
            "amazon_domain": "amazon.co.uk",
            "asin": search_result.asin,
            "currency": "gbp",
            "language": "en_GB",
        }
        # resp = await session.get(
        #     url="https://api.rainforestapi.com/request", params=params
        # )
        # res: "ProductApiResponse" = await resp.json()
        return cls(
            id=search_result.asin,
            title=search_result.title,
            price=search_result.price.value,
            description="",
            category="",
            image=search_result.image,
        )
