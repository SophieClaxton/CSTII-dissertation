from datetime import datetime
from fastapi import APIRouter

from ..static_files import (
    create_unpublished_task_workflow_url,
    delete_unpublished_task_workflow_file,
    get_unpublished_task_workflow_program,
    update_unpublished_task_workflow_program,
)
from ..exceptions.not_found import (
    unpublished_script_not_found_exception,
    user_not_found_exception,
    user_or_website_not_found_exception,
)
from ..database import DatabaseDep
from ..models.database_tables import Script, UnpublishedScript, User, Website
from ..models.responses import (
    BaseUnpublishedWorkflowResponse,
    SuccessResponse,
    UnpublishedWorkflowWithWebsiteResponse,
    FullUnpublishedWorkflowResponse,
)
from ..models.requests import UpdateUnpublishedWorkflowRequest
from ..models.CSTprogram import CSTProgram, CSTSectionNode, CSTSectionId

router = APIRouter(
    prefix="/unpublished_task_workflows", tags=["unpublished-task-workflows"]
)


@router.get(
    "/user/{user_id}", response_model=list[UnpublishedWorkflowWithWebsiteResponse]
)
def get_user_unpublished_task_workflows(
    user_id: int, session: DatabaseDep
) -> list[UnpublishedWorkflowWithWebsiteResponse]:
    if not (user := session.get(User, user_id)):
        raise user_not_found_exception(user_id)

    return [
        script.toUnpublishedScriptWithWebsiteResponse()
        for script in user.unpublished_scripts
    ]


@router.post("/user/{user_id}", response_model=BaseUnpublishedWorkflowResponse)
def create_user_unpublished_task_workflow(
    user_id: int, session: DatabaseDep
) -> BaseUnpublishedWorkflowResponse:
    if not (user := session.get(User, user_id)):
        raise user_not_found_exception(user_id)

    new_script_num = (
        max((script.id for script in user.unpublished_scripts), default=0) + 1
    )
    new_script_title = f"WIP #{new_script_num}"

    script_url = create_unpublished_task_workflow_url()
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


@router.get("/{workflow_id}", response_model=FullUnpublishedWorkflowResponse)
def get_unpublished_task_workflow(
    workflow_id: int, session: DatabaseDep
) -> FullUnpublishedWorkflowResponse:
    if not (script := session.get(UnpublishedScript, workflow_id)):
        raise unpublished_script_not_found_exception(workflow_id)

    if not (program := get_unpublished_task_workflow_program(script.script_url)):
        program = CSTProgram(
            sections=[
                CSTSectionNode(id=CSTSectionId(sectionId=1), url="", innerSteps=[])
            ]
        )

    annotations = []
    if script.published_script_id:
        if published_script := session.get(Script, script.published_script_id):
            annotations = published_script.annotations
    return script.toUnpublishedScriptWithProgramResponse(program, annotations)


@router.patch("/{workflow_id}", response_model=FullUnpublishedWorkflowResponse)
def update_unpublished_task_workflow(
    workflow_id: int, script: UpdateUnpublishedWorkflowRequest, session: DatabaseDep
) -> FullUnpublishedWorkflowResponse:
    if not (existing_script := session.get(UnpublishedScript, workflow_id)):
        raise unpublished_script_not_found_exception(workflow_id)

    if script.title:
        existing_script.title = script.title
    if script.description:
        existing_script.description = script.description
    if script.website_id:
        existing_script.website_id = script.website_id
    if script.published_script_id:
        existing_script.published_script_id = script.published_script_id
    if script.program:
        update_unpublished_task_workflow_program(
            existing_script.script_url, script.program
        )

    session.commit()
    session.refresh(existing_script)

    program = get_unpublished_task_workflow_program(existing_script.script_url)

    annotations = []
    if script.published_script_id:
        if published_script := session.get(Script, script.published_script_id):
            annotations = published_script.annotations

    return existing_script.toUnpublishedScriptWithProgramResponse(program, annotations)


@router.delete("/{workflow_id}", response_model=SuccessResponse)
def delete_unpublished_task_workflow(
    workflow_id: int, session: DatabaseDep
) -> SuccessResponse:
    if not (script := session.get(UnpublishedScript, workflow_id)):
        raise unpublished_script_not_found_exception(workflow_id)

    delete_unpublished_task_workflow_file(script.script_url)

    session.delete(script)
    session.commit()
    return SuccessResponse()


@router.get(
    "/user/{user_id}/{website_id}", response_model=list[BaseUnpublishedWorkflowResponse]
)
def get_user_website_unpublished_task_workflows(
    user_id: int, website_id: int, session: DatabaseDep
) -> list[BaseUnpublishedWorkflowResponse]:
    user = session.get(User, user_id)
    website = session.get(Website, website_id)
    if not user or not website:
        raise user_or_website_not_found_exception(
            user_id=user_id,
            user_found=bool(user),
            website_id=website_id,
            website_found=bool(website),
        )

    scripts = user.unpublished_scripts
    scripts_at_website = filter(
        (lambda script: script.website_id == website_id), scripts
    )

    return [script.toBaseUnpublishedScriptResponse() for script in scripts_at_website]
