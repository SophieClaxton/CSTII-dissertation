import pickle
import uuid
from os import path, remove

from .models.ASTprogram import ASTProgram
from .models.CSTprogram import CSTProgram

# Scripts

scripts_path = path.join("app", "static", "scripts")
unpublished_scripts_path = path.join("app", "static", "unpublished_scripts")


def create_script_file(program: ASTProgram) -> str:
    filename = f"{uuid.uuid4()}.pkl"
    file_path = path.join(scripts_path, filename)

    with open(file_path, "wb") as file:
        pickle.dump(program, file)

    return filename


def get_script_program(filename: str) -> ASTProgram:
    file_path = path.join(scripts_path, filename)

    if not path.exists(file_path):
        raise Exception(f"Could not find file {file_path}")

    with open(file_path, "rb") as file:
        program = pickle.load(file)
        assert isinstance(program, ASTProgram)
        return program


def update_script_program(filename: str, program: ASTProgram) -> None:
    file_path = path.join(scripts_path, filename)

    with open(file_path, "wb") as file:
        pickle.dump(program, file)
        return


def delete_script_file(filename: str) -> None:
    file_path = path.join(scripts_path, filename)

    if not path.exists(file_path):
        raise Exception(f"Could not find file {file_path}")

    remove(file_path)


# Unpublished Scripts


def create_unpublished_script_url() -> str:
    return str(uuid.uuid4())


def get_unpublished_script_program(filename: str) -> CSTProgram | None:
    file_path = path.join(unpublished_scripts_path, filename)

    if not path.exists(file_path):
        return None

    with open(file_path, "rb") as file:
        program = pickle.load(file)
        assert isinstance(program, CSTProgram)
        return program


def update_unpublished_script_program(filename: str, program: CSTProgram) -> None:
    file_path = path.join(unpublished_scripts_path, filename)

    with open(file_path, "wb") as file:
        pickle.dump(program, file)
        return


def delete_unpublished_script_file(filename: str) -> None:
    file_path = path.join(unpublished_scripts_path, filename)

    if not path.exists(file_path):
        raise Exception(f"Could not find file {file_path}")

    remove(file_path)
