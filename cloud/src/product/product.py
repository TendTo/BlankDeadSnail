from dataclasses import dataclass
import json
from random import randint
from faker import Faker


@dataclass
class Product:
    id: int
    name: str
    price: float
    quantity: int
    description: str
    category: str
    img: str | bytes

    @classmethod
    def generate_random(cls):
        fake = Faker("en_GB")
        return cls(
            id=randint(0, 1000),
            name=fake.name(),
            price=randint(0, 1000),
            quantity=randint(0, 1000),
            description=fake.text(),
            category=fake.word(),
            img=fake.image_url(),
        )

    def to_dict(self):
        return self.__dict__

    def to_json(self):
        return json.dumps(self.to_dict())
