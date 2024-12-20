from pydantic import BaseModel


class Program(BaseModel):
    section: str
