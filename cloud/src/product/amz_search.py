# pylint: disable=missing-function-docstring,missing-module-docstring,missing-class-docstring
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:

    class Currency(Enum):
        GBP = "GBP"

    class Symbol(Enum):
        empty = "£"

    @dataclass
    class ProductPrice:
        symbol: "Symbol"
        value: "float"
        currency: "Currency"
        raw: "str"

    @dataclass
    class AmazonProduct:
        asin: "str"
        link: "str"
        image: "str"
        title: "str"
        isprime: "bool"
        rating: "float | None" = None
        ratingstotal: "int | None" = None
        price: "ProductPrice | None" = None

    @dataclass
    class AdBlock:
        campaignid: "str"
        brandlogo: "str"
        backgroundimage: "str"
        advertiserid: "str"
        adid: "str"
        link: "str"
        title: "str"
        storelink: "str"
        storeid: "str"
        storename: "str"
        products: "list[AmazonProduct]"

    @dataclass
    class CategoryInformation:
        islandingpage: "bool"

    @dataclass
    class PaginationPage:
        totalresults: "int"
        currentpage: "int"
        nextpagelink: "str"
        totalpages: "int"

    @dataclass
    class Pagination:
        pages: "list[PaginationPage]"

    @dataclass
    class Refinement:
        name: "str"
        value: "str"
        refinementdisplayname: "str"
        link: "str | None" = None

    @dataclass
    class RelatedBrand:
        logo: "str"
        image: "str"
        title: "str"
        link: "str"
        storelink: "str"
        storeid: "str"
        storename: "str"

    @dataclass
    class RelatedSearch:
        query: "str"
        link: "str"

    @dataclass
    class RequestInfo:
        success: "bool"
        creditsused: "int"
        creditsremaining: "int"
        creditsusedthisrequest: "int"

    @dataclass
    class RequestMetadataPage:
        createdat: "datetime"
        processedat: "datetime"
        totaltimetaken: "float"
        page: "int"
        amazonurl: "str"

    @dataclass
    class RequestMetadata:
        createdat: "datetime"
        processedat: "datetime"
        totaltimetaken: "float"
        pages: "list[RequestMetadataPage]"

    @dataclass
    class RequestParameters:
        type: "str"
        amazondomain: "str"
        searchterm: "str"
        language: "str"
        currency: "str"
        maxpage: "int"

    @dataclass
    class AmazonsChoice:
        link: "str"
        keywords: "str"

    @dataclass
    class Bestseller:
        link: "str"
        category: "str"

    class CategoryName(Enum):
        AllDepartments = "All Departments"

    @dataclass
    class Category:
        name: "CategoryName"
        id: "str"

    @dataclass
    class Coupon:
        badgetext: "str"
        text: "str"

    @dataclass
    class Delivery:
        tagline: "str"

    class PriceName(Enum):
        Original = "Original"
        Primary = "Primary"

    @dataclass
    class SearchResultPrice:
        symbol: "Symbol"
        value: "float"
        currency: "Currency"
        raw: "str"
        name: "PriceName | None" = None
        isprimary: "bool | None" = None
        asin: "str | None" = None
        link: "str | None" = None
        isrrp: "bool | None" = None

    @dataclass
    class SearchResult:
        position: "int"
        title: "str"
        asin: "str"
        link: "str"
        categories: "list[Category]"
        image: "str"
        rating: "float"
        ratingstotal: "int"
        prices: "list[SearchResultPrice]"
        price: "SearchResultPrice"
        delivery: "Delivery"
        page: "int"
        positionoverall: "int"
        recentsales: "str | None" = None
        bestseller: "Bestseller | None" = None
        amazonschoice: "AmazonsChoice | None" = None
        isamazonbrand: "bool | None" = None
        isprime: "bool | None" = None
        coupon: "Coupon | None" = None

    @dataclass
    class VideoBlock:
        videolink: "str"
        thumbnaillink: "str"
        campaignid: "str"
        advertiserid: "str"
        hasaudio: "bool"

    @dataclass
    class SearchApiResponse:
        requestinfo: "RequestInfo"
        requestparameters: "RequestParameters"
        requestmetadata: "RequestMetadata"
        searchresults: "list[SearchResult]"
        categoryinformation: "CategoryInformation"
        relatedsearches: "list[RelatedSearch]"
        relatedbrands: "list[RelatedBrand]"
        pagination: "Pagination"
        refinements: "dict[str, list[Refinement]]"
        adblocks: "list[AdBlock]"
        videoblocks: "list[VideoBlock]"
