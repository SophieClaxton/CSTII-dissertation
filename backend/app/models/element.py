from pydantic import BaseModel


class Element(BaseModel):
    outerHtml: str
    url: str
    tag: str
