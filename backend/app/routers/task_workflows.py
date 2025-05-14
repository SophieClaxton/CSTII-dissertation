from fastapi import APIRouter
from sqlmodel import select

from ..static_files import (
    create_task_workflow_file,
    delete_task_workflow_file,
    get_task_workflow_program,
    update_task_workflow_program,
)
from ..exceptions.not_found import (
    script_not_found_exception,
    user_not_found_exception,
    user_or_website_not_found_exception,
    website_not_found_exception,
)
from ..database import DatabaseDep
from ..models.database_tables import (
    Annotation,
    Script,
    UnpublishedScript,
    User,
    Website,
)
from ..models.responses import (
    BaseWorkflowResponse,
    WorkflowWithAuthorAndWebsiteResponse,
    FullWorkflowResponse,
    SuccessResponse,
)
from ..models.requests import (
    PublishWorkflowRequest,
    CreateAnnotationRequest,
    UpdateWorkflowRequest,
)

router = APIRouter(prefix="/task_workflows", tags=["task-workflows"])


@router.get("/", response_model=list[WorkflowWithAuthorAndWebsiteResponse])
def get_task_workflows(
    session: DatabaseDep,
) -> list[WorkflowWithAuthorAndWebsiteResponse]:
    task_workflows = session.exec(select(Script)).all()
    return [script.toScriptWithAuthorAndWebsiteResponse() for script in task_workflows]


@router.post("/", response_model=BaseWorkflowResponse)
def create_task_workflow(
    workflow: PublishWorkflowRequest, session: DatabaseDep
) -> BaseWorkflowResponse:
    author = session.get(User, workflow.author_id)
    website = session.get(Website, workflow.website_id)
    if not author or not website:
        raise user_or_website_not_found_exception(
            user_id=workflow.author_id,
            user_found=bool(author),
            website_id=workflow.website_id,
            website_found=bool(website),
        )

    filename = create_task_workflow_file(program=workflow.program)
    new_workflow = Script(
        title=workflow.title,
        author_id=workflow.author_id,
        created_at=workflow.created_at,
        description=workflow.description,
        website_id=workflow.website_id,
        script_url=filename,
    )

    session.add(new_workflow)
    session.commit()
    session.refresh(new_workflow)

    return new_workflow.toBaseScriptResponse()


@router.patch("/{workflow_id}", response_model=SuccessResponse)
def update_task_workflow(
    workflow_id: int, workflow: UpdateWorkflowRequest, session: DatabaseDep
) -> SuccessResponse:
    print("Got update script request")
    if not (existing_workflow := session.get(Script, workflow_id)):
        raise script_not_found_exception(workflow_id)

    existing_workflow.title = workflow.title
    existing_workflow.description = workflow.description
    update_task_workflow_program(existing_workflow.script_url, workflow.program)

    session.commit()
    session.refresh(existing_workflow)
    return SuccessResponse(ok=True)


@router.get("/{workflow_id}", response_model=FullWorkflowResponse)
def get_task_workflow(workflow_id: int, session: DatabaseDep) -> FullWorkflowResponse:
    if not (workflow := session.get(Script, workflow_id)):
        raise script_not_found_exception(workflow_id)

    program = get_task_workflow_program(workflow.script_url)

    return workflow.toScriptWithProgramResponse(program)


@router.delete("/{workflow_id}", response_model=SuccessResponse)
def delete_task_workflow(workflow_id: int, session: DatabaseDep) -> SuccessResponse:
    if not (workflow := session.get(Script, workflow_id)):
        raise script_not_found_exception(workflow_id)

    delete_task_workflow_file(workflow.script_url)

    linked_unpublished_script = session.exec(
        select(UnpublishedScript).where(
            UnpublishedScript.published_script_id == workflow.id
        )
    ).first()
    if linked_unpublished_script:
        linked_unpublished_script.published_script_id = None

    session.delete(workflow)
    session.commit()

    return SuccessResponse()


@router.post("/{workflow_id}/annotate", response_model=SuccessResponse)
def create_annotation(
    workflow_id: int, annotation: CreateAnnotationRequest, session: DatabaseDep
) -> SuccessResponse:
    if not (workflow := session.get(Script, workflow_id)):
        raise script_not_found_exception(workflow_id)

    new_annotation = Annotation(
        script_id=workflow.id,
        location=annotation.location,
        description=annotation.description,
    )
    session.add(new_annotation)
    session.commit()

    return SuccessResponse()


@router.get(
    "/user/{user_id}", response_model=list[WorkflowWithAuthorAndWebsiteResponse]
)
def get_user_task_workflows(
    user_id: int, session: DatabaseDep
) -> list[WorkflowWithAuthorAndWebsiteResponse]:
    if not (user := session.get(User, user_id)):
        raise user_not_found_exception(user_id)

    return [script.toScriptWithAuthorAndWebsiteResponse() for script in user.scripts]


@router.get(
    "/website/{website_id}", response_model=list[WorkflowWithAuthorAndWebsiteResponse]
)
def get_website_task_workflows(
    website_id: int, session: DatabaseDep
) -> list[WorkflowWithAuthorAndWebsiteResponse]:
    if not (website := session.get(Website, website_id)):
        raise website_not_found_exception(website_id)

    return [script.toScriptWithAuthorAndWebsiteResponse() for script in website.scripts]
