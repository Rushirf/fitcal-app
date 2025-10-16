# FastAPI Demo Project

This is a simple FastAPI project with a database connection.

## Setup and Run

After cloning the repository to a new device, follow these steps to run the application:

1.  **Navigate to the project directory:**
    ```bash
    cd fastapi

2.  **Create and activate a virtual environment:**
    *   On Windows:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
    *   On macOS/Linux:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

3.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create a `.env` file:**
    Create a file named `.env` in the root of the project and add your database credentials. You can use the `.env.example` as a template.
    ```
    DB_USER="your_database_user"
    DB_PASSWORD="your_database_password"
    DB_HOST="your_database_host"
    DB_NAME="your_database_name"
    ```

5.  **Run the application:**
    ```bash
    uvicorn main:app --reload
    ```

The application will be running at `http://127.0.0.1:8000`.
