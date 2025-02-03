from pydantic import BaseModel


class Element(BaseModel):
    outerHTML: str
    url: str
    tag: str
    textContent: str | None = None
    label: str | None = None
