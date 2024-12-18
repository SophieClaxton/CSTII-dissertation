from fastapi import APIRouter

router = APIRouter(prefix="/scripts", tags=["scripts"])


@router.get("/")
def get_scripts(name_query: str = None):
    return {"scripts": []}


@router.post("/")
def create_script():
    return {"script": {}}


@router.get("/{script_id}")
def get_script(script_id: int):
    return {"script": {}}


@router.delete("/{script_id}")
def delete_script(script_id: int):
    return {"script": {}}


@router.get("/{script_id}/annotations")
def get_annotations(script_id: int):
    return {"annotations": []}


@router.post("/{script_id}/annotations")
def create_annotation(script_id: int):
    return {"annotation": {}}


@router.get("/{user_id}")
def get_user_scripts(user_id: int):
    return {"scripts": []}


@router.get("/{website_id}")
def get_website_scripts(website_id: int):
    return {"scripts": []}
