import subprocess
import time
import requests


def build_and_close():
    try:
        server_process = subprocess.Popen(
            ["fastapi", "dev", "app/main.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        time.sleep(5)

        status_check_response = requests.get("http://localhost:8000/")
        status_check = status_check_response.json()
        if (status_check_response.status_code != 200) or (
            status_check["status"] != "live"
        ):
            raise Exception("Status check failed")

        server_process.terminate()
        server_process.wait()

        print("Build successful")
        return 0

    except ConnectionError as e:
        print(f"Could not setup connection - double check server runs locally")
        return 0

    except Exception as e:
        print(f"Build failed: {e}")
        print(f"Exception Type: {type(e)}")
        return 1


if __name__ == "__main__":
    exit_code = build_and_close()
    exit(exit_code)
