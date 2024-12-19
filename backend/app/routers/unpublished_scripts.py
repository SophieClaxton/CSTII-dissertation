from datetime import datetime
from fastapi import APIRouter
from typing import List

from ..exceptions.not_found import (
    unpublished_script_not_found_exception,
    user_not_found_exception,
    user_or_website_not_found_exception,
)
from ..database import DatabaseDep
from ..models.wip_program import WipProgram
from ..models.database_tables import UnpublishedScript, User, Website
from ..models.responses import (
    BaseUnpublishedScriptResponse,
    SuccessResponse,
    UnpublishedScriptWithWebsiteResponse,
    UnpublishedScriptWithProgramResponse,
)
from ..models.requests import UpdateUnpublishedScriptRequest

router = APIRouter(prefix="/unpublished_scripts", tags=["unpublished_scripts"])


@router.get(
    "/user/{user_id}", response_model=List[UnpublishedScriptWithWebsiteResponse]
)
def get_user_unpublished_scripts(
    user_id: int, session: DatabaseDep, name_query: str | None = None
) -> List[UnpublishedScriptWithWebsiteResponse]:
    # TODO: include `name_query` in search
    user = session.get(User, user_id)
    if not user:
        raise user_not_found_exception(user_id)
    return [
        script.toUnpublishedScriptWithWebsiteResponse()
        for script in user.unpublished_scripts
    ]


@router.post("/user/{user_id}", response_model=BaseUnpublishedScriptResponse)
def create_user_unpublished_script(
    user_id: int, session: DatabaseDep
) -> BaseUnpublishedScriptResponse:
    user = session.get(User, user_id)
    if not user:
        raise user_not_found_exception(user_id)
    # TODO: create a script url
    new_script = UnpublishedScript(
        author_id=user.id, script_url="URL", created_at=datetime.now()
    )
    session.add(new_script)
    session.commit()
    session.refresh(new_script)
    return new_script.toBaseUnpublishedScriptResponse()


@router.get("/{script_id}", response_model=UnpublishedScriptWithProgramResponse)
def get_unpublished_script(
    script_id: int, session: DatabaseDep
) -> UnpublishedScriptWithProgramResponse:
    script = session.get(UnpublishedScript, script_id)
    if not script:
        raise unpublished_script_not_found_exception(script_id)
    # TODO: retrieve stored program
    program = WipProgram()
    return script.toUnpublishedScriptWithProgramResponse(program)


@router.patch("/{script_id}", response_model=UnpublishedScriptWithProgramResponse)
def update_unpublished_script(
    script_id: int, script: UpdateUnpublishedScriptRequest, session: DatabaseDep
) -> UnpublishedScriptWithProgramResponse:
    existing_script = session.get(UnpublishedScript, script_id)
    if not existing_script:
        raise unpublished_script_not_found_exception(script_id)

    if script.title:
        existing_script.title = script.title
    if script.description:
        existing_script.description = script.description
    if script.website_id:
        existing_script.website_id = script.website_id
    if script.program:
        # TODO: save the program to the file at script.url
        pass

    session.commit()
    session.refresh(existing_script)

    # TODO: retrieve program
    program = WipProgram()

    return existing_script.toUnpublishedScriptWithProgramResponse(program)


@router.delete("/{script_id}", response_model=SuccessResponse)
def delete_unpublished_script(script_id: int, session: DatabaseDep) -> SuccessResponse:
    script = session.get(UnpublishedScript, script_id)
    if not script:
        raise unpublished_script_not_found_exception(script_id)

    # TODO: delete the program file
    session.delete(script)
    session.commit()
    return SuccessResponse()


@router.get(
    "user/{user_id}/{website_id}", response_model=List[BaseUnpublishedScriptResponse]
)
def get_user_website_unpublished_scripts(
    user_id: int, website_id: int, session: DatabaseDep
) -> List[BaseUnpublishedScriptResponse]:
    user = session.get(User, user_id)
    website = session.get(Website, website_id)
    if not user or not website:
        raise user_or_website_not_found_exception(
            user_id=user_id,
            user_found=True if user else False,
            website_id=website_id,
            website_found=True if website else False,
        )

    scripts = user.unpublished_scripts
    scripts_at_website = filter(
        (lambda script: script.website_id == website_id), scripts
    )
    return [script.toBaseUnpublishedScriptResponse() for script in scripts_at_website]
