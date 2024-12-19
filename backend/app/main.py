from typing import Any, Generator
from fastapi import FastAPI
from sqlmodel import Session

from .config import get_settings
from .database import create_db_and_tables, insert_default_data
from .models.StatusReport import StatusReport
from .models.database_tables import User
from .routers import scripts, unpublished_scripts, users, websites


def lifespan(app: FastAPI):
    settings = get_settings()
    if settings.create_tables:
        create_db_and_tables()
        insert_default_data()

    yield


app = FastAPI(lifespan=lifespan)

app.include_router(scripts.router)
app.include_router(unpublished_scripts.router)
app.include_router(users.router)
app.include_router(websites.router)


@app.get("/")
def get_status():
    status = StatusReport(status="live")
    return status
