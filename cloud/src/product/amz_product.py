# pylint: disable=missing-function-docstring,missing-module-docstring,missing-class-docstring
from enum import Enum
from dataclasses import dataclass
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:

    class Currency(Enum):
        GBP = "GBP"

    class Symbol(Enum):
        empty = "£"

    @dataclass
    class TotalPrice:
        symbol: Symbol
        value: float
        currency: Currency
        raw: str

    @dataclass
    class NewerModel:
        title: str
        asin: str
        link: str
        image: str
        rating: float
        ratingstotal: int
        price: Optional[TotalPrice] = None

    @dataclass
    class BrandStore:
        id: str
        link: str

    @dataclass
    class ProductElement:
        asin: str
        title: str
        link: str
        image: str
        price: Optional[TotalPrice] = None

    @dataclass
    class FrequentlyBoughtTogether:
        totalprice: TotalPrice
        products: list[ProductElement]

    @dataclass
    class APlusContent:
        hasapluscontent: bool
        hasbrandstory: bool
        thirdparty: bool

    @dataclass
    class Attribute:
        name: str
        value: str

    @dataclass
    class BestsellersRank:
        category: str
        rank: int
        link: str

    @dataclass
    class Availability:
        type: str
        raw: str
        dispatchdays: int
        stocklevel: int

    @dataclass
    class Condition:
        isnew: bool

    @dataclass
    class Delivery:
        date: str
        name: str

    @dataclass
    class ThirdPartySeller:
        name: str
        link: str
        id: str
        image: Optional[str] = None

    @dataclass
    class Fulfillment:
        type: str
        standarddelivery: Delivery
        fastestdelivery: Delivery
        issoldbyamazon: bool
        isfulfilledbyamazon: bool
        isfulfilledbythirdparty: bool
        issoldbythirdparty: bool
        thirdpartyseller: ThirdPartySeller

    @dataclass
    class MaximumOrderQuantity:
        value: int
        hardmaximum: bool

    @dataclass
    class MixedOffersFrom:
        raw: str

    @dataclass
    class BuyboxWinner:
        maximumorderquantity: MaximumOrderQuantity
        mixedofferscount: int
        mixedoffersfrom: MixedOffersFrom
        isprime: bool
        isprimeexclusivedeal: bool
        isamazonfresh: bool
        condition: Condition
        availability: Availability
        fulfillment: Fulfillment
        price: TotalPrice
        rrp: TotalPrice
        shipping: MixedOffersFrom

    @dataclass
    class Category:
        name: str
        link: Optional[str] = None
        categoryid: Optional[str] = None

    @dataclass
    class Document:
        name: str
        link: str

    @dataclass
    class EnergyEfficiency:
        pass

    @dataclass
    class FirstAvailable:
        raw: str
        utc: datetime

    class VariantEnum(Enum):
        EV01 = "EV01"
        MAIN = "MAIN"
        PT01 = "PT01"
        PT02 = "PT02"
        PT03 = "PT03"
        PT04 = "PT04"
        PT05 = "PT05"

    @dataclass
    class Image:
        link: str
        variant: VariantEnum

    @dataclass
    class MainImage:
        link: str

    @dataclass
    class MoreBuyingChoice:
        price: TotalPrice
        sellername: str
        sellerlink: str
        position: int
        freeshipping: Optional[bool] = None

    @dataclass
    class Star:
        percentage: int
        count: int

    @dataclass
    class RatingBreakdown:
        fivestar: Star
        fourstar: Star
        threestar: Star
        twostar: Star
        onestar: Star

    @dataclass
    class SearchAlias:
        title: str
        value: str

    @dataclass
    class SubTitle:
        text: str
        link: str

    @dataclass
    class TopReview:
        id: str
        title: str
        body: str
        asin: str
        bodyhtml: str
        link: str
        rating: int
        date: FirstAvailable
        profile: ThirdPartySeller
        vineprogram: bool
        verifiedpurchase: bool
        reviewcountry: str
        isglobalreview: bool

    @dataclass
    class VariantElement:
        asin: str
        title: str
        iscurrentproduct: bool
        link: str
        dimensions: list[Attribute]
        mainimage: str
        images: list[Image]

    @dataclass
    class AmazonProductProduct:
        title: str
        searchalias: SearchAlias
        titleexcludingvariantname: str
        keywords: str
        keywordslist: list[str]
        asin: str
        parentasin: str
        link: str
        brand: str
        sellonamazon: bool
        variants: list[VariantElement]
        variantasinsflat: str
        energyefficiency: EnergyEfficiency
        documents: list[Document]
        categories: list[Category]
        categoriesflat: str
        apluscontent: APlusContent
        subtitle: SubTitle
        marketplaceid: str
        rating: float
        ratingbreakdown: RatingBreakdown
        ratingstotal: int
        mainimage: MainImage
        images: list[Image]
        imagescount: int
        imagesflat: str
        isbundle: bool
        featurebullets: list[str]
        featurebulletscount: int
        featurebulletsflat: str
        attributes: list[Attribute]
        topreviews: list[TopReview]
        buyboxwinner: BuyboxWinner
        morebuyingchoices: list[MoreBuyingChoice]
        specifications: list[Attribute]
        specificationsflat: str
        bestsellersrank: list[BestsellersRank]
        manufacturer: str
        weight: str
        firstavailable: FirstAvailable
        dimensions: str
        modelnumber: str
        bestsellersrankflat: str
        whatsinthebox: list[str]

    @dataclass
    class RequestInfo:
        success: bool
        creditsused: int
        creditsremaining: int
        creditsusedthisrequest: int

    @dataclass
    class RequestMetadata:
        createdat: datetime
        processedat: datetime
        totaltimetaken: float
        amazonurl: str

    @dataclass
    class RequestParameters:
        type: str
        amazondomain: str
        asin: str
        currency: str
        language: str

    @dataclass
    class ProductApiResponse:
        requestinfo: RequestInfo
        requestparameters: RequestParameters
        requestmetadata: RequestMetadata
        product: AmazonProductProduct
        brandstore: BrandStore
        userguide: str
        newermodel: NewerModel
        frequentlyboughttogether: FrequentlyBoughtTogether
        comparewithsimilar: list[NewerModel]
        alsobought: list[NewerModel]
