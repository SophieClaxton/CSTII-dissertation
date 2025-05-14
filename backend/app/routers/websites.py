from fastapi import APIRouter
from sqlmodel import select

from ..exceptions.not_found import website_not_found_exception
from ..database import DatabaseDep
from ..models.responses import BaseWebsiteResponse, WebsiteWithWorkflowsResponse
from ..models.requests import CreateWebsiteRequest
from ..models.database_tables import Website

router = APIRouter(prefix="/websites", tags=["websites"])


@router.get("/", response_model=list[BaseWebsiteResponse])
def get_websites(
    session: DatabaseDep, _name_query: str | None = None
) -> list[BaseWebsiteResponse]:
    # TODO: include `name_query` in the search
    websites = session.exec(select(Website)).all()
    return [website.toBaseWesbiteResponse() for website in websites]


@router.post("/", response_model=BaseWebsiteResponse)
def create_website(
    website: CreateWebsiteRequest, session: DatabaseDep
) -> BaseWebsiteResponse:
    new_website = Website(url=website.url, descrpition=website.description)
    session.add(new_website)
    session.commit()
    session.refresh(new_website)
    return new_website.toBaseWesbiteResponse()


@router.get("/{website_id}", response_model=WebsiteWithWorkflowsResponse)
def get_website(website_id: int, session: DatabaseDep) -> WebsiteWithWorkflowsResponse:
    if not (website := session.get(Website, website_id)):
        raise website_not_found_exception(website_id)
    return website.toWebsiteWithScriptsResponse()
