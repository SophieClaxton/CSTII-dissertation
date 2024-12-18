from pydantic import BaseModel


class StatusReport(BaseModel):
    status: str
