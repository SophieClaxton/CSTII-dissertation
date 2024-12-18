from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class StatusReport(BaseModel):
  status: str

@app.get("/")
def get_status() -> StatusReport:
  return {"status": "live"}