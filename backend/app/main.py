from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager


from .config import get_settings
from .database import create_db_and_tables, insert_default_data
from .models.responses import StatusResponse
from .routers import task_workflows, unpublished_task_workflows, users, websites


@asynccontextmanager
async def lifespan(_app: FastAPI):
    settings = get_settings()
    if settings.create_tables:
        create_db_and_tables()
        insert_default_data()

    yield


app = FastAPI(lifespan=lifespan)

app.include_router(task_workflows.router)
app.include_router(unpublished_task_workflows.router)
app.include_router(users.router)
app.include_router(websites.router)


@app.get("/", response_model=StatusResponse)
def get_status():
    status = StatusResponse(status="live")
    return status
