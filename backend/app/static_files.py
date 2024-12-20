import pickle
import uuid
from os import path, remove

from .models.program import Program
from .models.wip_program import WipProgram

# Scripts

scripts_path = path.join("app", "static", "scripts")
unpublished_scripts_path = path.join("app", "static", "unpublished_scripts")


def create_script_file(program: Program) -> str:
    filename = f"{uuid.uuid4()}.pkl"
    file_path = path.join(scripts_path, filename)

    with open(file_path, "wb") as file:
        pickle.dump(program, file)

    return filename


def get_script_program(filename: str) -> Program:
    file_path = path.join(scripts_path, filename)

    if not path.exists(file_path):
        raise Exception(f"Could not find file {file_path}")

    with open(file_path, "rb") as file:
        program = pickle.load(file)
        assert isinstance(program, Program)
        return program


def delete_script_file(filename: str) -> None:
    file_path = path.join(scripts_path, filename)

    if not path.exists(file_path):
        raise Exception(f"Could not find file {file_path}")

    remove(file_path)
    return


# Unpublished Scripts


def create_unpublished_script_url() -> str:
    return str(uuid.uuid4())


def get_unpublished_script_program(filename: str) -> WipProgram | None:
    file_path = path.join(unpublished_scripts_path, filename)

    if not path.exists(file_path):
        return None

    with open(file_path, "rb") as file:
        program = pickle.load(file)
        assert isinstance(program, WipProgram)
        return program


def update_unpublished_script_program(filename: str, program: WipProgram) -> None:
    file_path = path.join(unpublished_scripts_path, filename)

    with open(file_path, "wb") as file:
        pickle.dump(program, file)
        return


def delete_unpublished_script_file(filename: str) -> None:
    file_path = path.join(unpublished_scripts_path, filename)

    if not path.exists(file_path):
        raise Exception(f"Could not find file {file_path}")

    remove(file_path)
    return
