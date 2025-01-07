from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Annotated
from fastapi import Depends


class Settings(BaseSettings):
    create_tables: bool = False
    database_name: str = "database.db"

    model_config = SettingsConfigDict(env_file="./app/.env")


@lru_cache
def get_settings():
    return Settings()


SettingsDep = Annotated[Settings, Depends(get_settings)]
