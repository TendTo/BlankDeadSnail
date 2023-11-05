import redis
import os


def get_redis():
    return redis.Redis(
        host=os.environ["REDIS_HOST"],
        port=os.environ["REDIS_PORT"],
        password=os.environ["REDIS_PSW"],
    )


def retrieve_from_cache(key: "str") -> "str | None":
    r = get_redis()
    return r.get(key)


def store_in_cache(key: "str", value: "str"):
    r = get_redis()
    r.set(key, value)
