## Overview

This project includes a Chrome extension and small back-end server to support individuals with low digital capability access particular online services.

## Prerequisites

This project was built with
* Node.js v20.18.0.
* Python 3.10.11 

Before building or running either the front-end or back-end the dependencies need to be installed.

* To install the front-end dependencies, navigate to the `frontend` directory and run
```bash
npm install
```

* To install the back-end dependencies, navigate to the `backend` directory and run
```bash
pip install requirements.txt
```


## Usage

### Front-End Chrome Extension

To build the Chrome Extension, navigate to the `frontend` directory and run

```bash
npm run build
```


### Back-End Server

To start up the back-end server running on `localhost:8000`, navigate to the `backend` directory and run

```bash
fastapi dev app/main.py
```
