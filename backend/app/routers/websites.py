from fastapi import APIRouter
from typing import List

from ..models.responses import BaseWebsiteResponse, WebsiteWithScriptsResponse
from ..models.requests import CreateWebsiteRequest

router = APIRouter(prefix="/websites", tags=["websites"])


@router.get("/", response_model=List[BaseWebsiteResponse])
def get_websites(name_query: str | None = None) -> List[BaseWebsiteResponse]:
    return []


@router.post("/", response_model=BaseWebsiteResponse)
def create_website(website: CreateWebsiteRequest) -> BaseWebsiteResponse:
    return BaseWebsiteResponse(id=0, url="gov.uk", description="The UK Gov")


@router.get("/{website_id}", response_model=WebsiteWithScriptsResponse)
def get_website() -> WebsiteWithScriptsResponse:
    return WebsiteWithScriptsResponse(
        id=0, url="gov.uk", description="The UK Gov", scripts=[]
    )
