from sqlmodel import create_engine, SQLModel, Session
from typing import Annotated
from fastapi import Depends

from .models.database_tables import User

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


async def get_session():
    with Session(engine) as session:
        yield session


DatabaseDep = Annotated[Session, Depends(get_session)]


def insert_default_data():
    with Session(engine) as session:
        user_1 = User(name="user_1")
        session.add(user_1)
        session.commit()
