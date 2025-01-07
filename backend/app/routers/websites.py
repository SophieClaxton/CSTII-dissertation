from fastapi import APIRouter
from typing import List
from sqlmodel import select

from ..exceptions.not_found import website_not_found_exception
from ..database import DatabaseDep
from ..models.responses import BaseWebsiteResponse, WebsiteWithScriptsResponse
from ..models.requests import CreateWebsiteRequest
from ..models.database_tables import Website

router = APIRouter(prefix="/websites", tags=["websites"])


@router.get("/", response_model=List[BaseWebsiteResponse])
def get_websites(
    session: DatabaseDep, name_query: str | None = None
) -> List[BaseWebsiteResponse]:
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


@router.get("/{website_id}", response_model=WebsiteWithScriptsResponse)
def get_website(website_id: int, session: DatabaseDep) -> WebsiteWithScriptsResponse:
    website = session.get(Website, website_id)
    if not website:
        raise website_not_found_exception(website_id)
    return website.toWebsiteWithScriptsResponse()
