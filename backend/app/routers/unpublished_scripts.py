from fastapi import APIRouter

router = APIRouter(prefix="/unpublished_scripts", tags=["unpublished_scripts"])


@router.get("/{user_id}")
def get_user_unpublished_scripts(user_id: int, name_query: str = None):
    return {"scripts": []}


@router.post("/{user_id}")
def create_user_unpublished_script(user_id: int):
    return {"script": {}}


@router.get("/{script_id}")
def get_unpublished_script(script_id: int):
    return {"script": {}}


@router.put("/{script_id}")
def update_unpublished_script(script_id: int):
    return {"script": {}}


@router.delete("/{script_id}")
def delete_unpublished_script(script_id: int):
    return {"script": {}}


@router.get("/{user_id}/{website_id}")
def get_user_website_unpublished_scripts(user_id: int, website_id: int):
    return {"scripts": []}
