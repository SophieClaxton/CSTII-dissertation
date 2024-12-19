from fastapi import HTTPException, status


def user_not_found_exception(user_id: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Could not find a user with id {user_id}",
    )


def website_not_found_exception(website_id: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Could not find a website with id {website_id}",
    )


def user_or_website_not_found_exception(user_id: int | None, website_id: int | None):
    if user_id and website_id:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Could not find user with id {user_id} or website with id {website_id}",
        )
    elif user_id:
        return user_not_found_exception(user_id)
    elif website_id:
        return website_not_found_exception(website_id)
    else:
        return Exception("Called with valid user_id and website_id")


def script_not_found_exception(script_id: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Could not find a test with id {script_id}",
    )
