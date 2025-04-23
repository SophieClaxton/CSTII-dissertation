from fastapi import APIRouter
from sqlmodel import select

from ..static_files import (
    create_script_file,
    delete_script_file,
    get_script_program,
    update_script_program,
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
    BaseScriptResponse,
    ScriptWithAuthorAndWebsiteResponse,
    ScriptWithProgramResponse,
    SuccessResponse,
)
from ..models.requests import (
    PublishScriptRequest,
    CreateAnnotationRequest,
    UpdateScriptRequest,
)

router = APIRouter(prefix="/scripts", tags=["scripts"])


@router.get("/", response_model=list[ScriptWithAuthorAndWebsiteResponse])
def get_scripts(
    session: DatabaseDep,
) -> list[ScriptWithAuthorAndWebsiteResponse]:
    scripts = session.exec(select(Script)).all()
    return [script.toScriptWithAuthorAndWebsiteResponse() for script in scripts]


@router.post("/", response_model=BaseScriptResponse)
def create_script(
    script: PublishScriptRequest, session: DatabaseDep
) -> BaseScriptResponse:
    author = session.get(User, script.author_id)
    website = session.get(Website, script.website_id)
    if not author or not website:
        raise user_or_website_not_found_exception(
            user_id=script.author_id,
            user_found=bool(author),
            website_id=script.website_id,
            website_found=bool(website),
        )

    filename = create_script_file(program=script.program)
    new_script = Script(
        title=script.title,
        author_id=script.author_id,
        created_at=script.created_at,
        description=script.description,
        website_id=script.website_id,
        script_url=filename,
    )

    session.add(new_script)
    session.commit()
    session.refresh(new_script)

    return new_script.toBaseScriptResponse()


@router.patch("/{script_id}", response_model=SuccessResponse)
def update_script(
    script_id: int, script: UpdateScriptRequest, session: DatabaseDep
) -> SuccessResponse:
    print("Got update script request")
    if not (existing_script := session.get(Script, script_id)):
        raise script_not_found_exception(script_id)

    existing_script.title = script.title
    existing_script.description = script.description
    update_script_program(existing_script.script_url, script.program)

    session.commit()
    session.refresh(existing_script)
    return SuccessResponse(ok=True)


@router.get("/{script_id}", response_model=ScriptWithProgramResponse)
def get_script(script_id: int, session: DatabaseDep) -> ScriptWithProgramResponse:
    if not (script := session.get(Script, script_id)):
        raise script_not_found_exception(script_id)

    program = get_script_program(script.script_url)

    return script.toScriptWithProgramResponse(program)


@router.delete("/{script_id}", response_model=SuccessResponse)
def delete_script(script_id: int, session: DatabaseDep) -> SuccessResponse:
    if not (script := session.get(Script, script_id)):
        raise script_not_found_exception(script_id)

    delete_script_file(script.script_url)

    linked_unpublished_script = session.exec(
        select(UnpublishedScript).where(
            UnpublishedScript.published_script_id == script.id
        )
    ).first()
    if linked_unpublished_script:
        linked_unpublished_script.published_script_id = None

    session.delete(script)
    session.commit()

    return SuccessResponse()


@router.post("/{script_id}/annotate", response_model=SuccessResponse)
def create_annotation(
    script_id: int, annotation: CreateAnnotationRequest, session: DatabaseDep
) -> SuccessResponse:
    if not (script := session.get(Script, script_id)):
        raise script_not_found_exception(script_id)

    new_annotation = Annotation(
        script_id=script.id,
        location=annotation.location,
        description=annotation.description,
    )
    session.add(new_annotation)
    session.commit()

    return SuccessResponse()


@router.get("/user/{user_id}", response_model=list[ScriptWithAuthorAndWebsiteResponse])
def get_user_scripts(
    user_id: int, session: DatabaseDep
) -> list[ScriptWithAuthorAndWebsiteResponse]:
    if not (user := session.get(User, user_id)):
        raise user_not_found_exception(user_id)

    return [script.toScriptWithAuthorAndWebsiteResponse() for script in user.scripts]


@router.get(
    "/website/{website_id}", response_model=list[ScriptWithAuthorAndWebsiteResponse]
)
def get_website_scripts(
    website_id: int, session: DatabaseDep
) -> list[ScriptWithAuthorAndWebsiteResponse]:
    if not (website := session.get(Website, website_id)):
        raise website_not_found_exception(website_id)

    return [script.toScriptWithAuthorAndWebsiteResponse() for script in website.scripts]
