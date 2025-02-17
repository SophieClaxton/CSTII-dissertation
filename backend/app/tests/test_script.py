from app.models.requests import UpdateUnpublishedScriptRequest
from ..models.ASTprogram import ASTProgram
import time
import timeit
import json


def test_script_load_time():
    with open("./app/tests/consts/unpublished_script_simple.json") as file:
        data = json.load(file)
        time.sleep(3)
        start = timeit.timeit()
        script = UpdateUnpublishedScriptRequest.model_validate(data)
        end = timeit.timeit()
        time_taken = end - start
        assert time_taken < 10


def test_program_load_time():
    with open("./app/tests/consts/script_inputs.json") as file:
        data = json.load(file)
        time.sleep(3)
        start = timeit.timeit()
        program = ASTProgram.model_validate(data)
        end = timeit.timeit()
        time_taken = end - start
        assert time_taken < 10


if __name__ == "__main__":
    test_program_load_time()
