from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Annotated
from fastapi import Depends


class Settings(BaseSettings):
    create_tables: bool
    database_name: str

    model_config = SettingsConfigDict(env_file="./app/.env")


@lru_cache
def get_settings():
    return Settings()


SettingsDep = Annotated[Settings, Depends(get_settings)]
