from fastapi import FastAPI
from .models.StatusReport import StatusReport
from .routers import scripts, unpublished_scripts, users, websites

app = FastAPI()

app.include_router(scripts.router)
app.include_router(unpublished_scripts.router)
app.include_router(users.router)
app.include_router(websites.router)


@app.get("/")
def get_status():
    status = StatusReport(status="live")
    return status
