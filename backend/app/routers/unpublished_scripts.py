from datetime import datetime
from fastapi import APIRouter
from typing import List

from ..static_files import (
    create_unpublished_script_url,
    delete_unpublished_script_file,
    get_unpublished_script_program,
    update_unpublished_script_program,
)
from ..exceptions.not_found import (
    unpublished_script_not_found_exception,
    user_not_found_exception,
    user_or_website_not_found_exception,
)
from ..database import DatabaseDep
from ..models.database_tables import Script, UnpublishedScript, User, Website
from ..models.responses import (
    BaseUnpublishedScriptResponse,
    SuccessResponse,
    UnpublishedScriptWithWebsiteResponse,
    UnpublishedScriptWithProgramResponse,
)
from ..models.requests import UpdateUnpublishedScriptRequest
from ..models.CSTprogram import CSTProgram, CSTSectionId, CSTSectionNode

router = APIRouter(prefix="/unpublished_scripts", tags=["unpublished_scripts"])


@router.get(
    "/user/{user_id}", response_model=List[UnpublishedScriptWithWebsiteResponse]
)
def get_user_unpublished_scripts(
    user_id: int, session: DatabaseDep
) -> List[UnpublishedScriptWithWebsiteResponse]:
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

    new_script_num = (
        max([script.id for script in user.unpublished_scripts], default=0) + 1
    )
    new_script_title = f"WIP #{new_script_num}"

    script_url = create_unpublished_script_url()
    new_script = UnpublishedScript(
        title=new_script_title,
        author_id=user.id,
        script_url=script_url,
        created_at=datetime.now(),
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

    program = get_unpublished_script_program(script.script_url)
    if not program:
        program = CSTProgram(
            sections=[
                CSTSectionNode(id=CSTSectionId(sectionId=1), url="", innerSteps=[])
            ]
        )
    annotations = None
    if script.published_script_id:
        published_script = session.get(Script, script.published_script_id)
        if published_script:
            annotations = published_script.annotations
    return script.toUnpublishedScriptWithProgramResponse(program, annotations)


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
    if script.published_script_id:
        existing_script.published_script_id = script.published_script_id
    if script.program:
        update_unpublished_script_program(existing_script.script_url, script.program)

    session.commit()
    session.refresh(existing_script)

    program = get_unpublished_script_program(existing_script.script_url)

    return existing_script.toUnpublishedScriptWithProgramResponse(program, None)


@router.delete("/{script_id}", response_model=SuccessResponse)
def delete_unpublished_script(script_id: int, session: DatabaseDep) -> SuccessResponse:
    script = session.get(UnpublishedScript, script_id)
    if not script:
        raise unpublished_script_not_found_exception(script_id)

    delete_unpublished_script_file(script.script_url)

    session.delete(script)
    session.commit()
    return SuccessResponse()


@router.get(
    "/user/{user_id}/{website_id}", response_model=List[BaseUnpublishedScriptResponse]
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
