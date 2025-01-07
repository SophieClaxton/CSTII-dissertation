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


def user_or_website_not_found_exception(
    user_id: int, user_found: bool, website_id: int, website_found: bool
):
    if not user_found and not website_found:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Could not find user with id {user_id} or website with id {website_id}",
        )
    elif not user_found:
        return user_not_found_exception(user_id)
    elif not website_found:
        return website_not_found_exception(website_id)
    else:
        return Exception("Called with valid user_id and website_id")


def script_not_found_exception(script_id: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Could not find a test with id {script_id}",
    )


def unpublished_script_not_found_exception(script_id: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Could not find an unpublished script with id {script_id}",
    )
