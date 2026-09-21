# Task Manager API

A lightweight, local-memory REST API built with Node.js and Express to manage tasks. 

> ⚠️ **Note:** This project (v1.0) previously used **in-memory storage** (`local memory`). Any data created, updated, or deleted was reset whenever the server restarted.

> Update v1.1 now uses SQLite database to hold the data. SQLite was selected mainly because it's lightweight. Further updates will likely use more mainstream database systems, e.g. PostgreSQL

> Update v1.2: The API is now containerized! You now only need to have a running version of Docker on your machine to now use this app.

## Prerequisites

Ensure you have installed **Docker** and **Docker Compose** in your machine

## Getting Started

Follow these steps to set up and run the API locally.

### 1. Clone the Repository
```bash
git clone https://github.com/ambanigodwin/my-first-crud-api
cd my-first-crud-api
```

### 2. Launch the containers
Run the following command in your terminal from the root project directory:
```bash
docker compose up -d
```
*This command downloads all necessary images, builds your Node API, and launches the entire stack in the background.*

### 3. Run the Application
The server runs on port `3000` by default.
* **Development Mode** (requires `nodemon` installed to auto-restart on changes):
  ```bash
  npm run dev
  ```
* **Standard Mode**:
  ```bash
  npm start
  ```

## API Endpoints

You can test these endpoints using tools like Postman, Bruno, cURL or swaggerUI.

| Method | Endpoint | Request Body (JSON) | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | *None* | Retrieve all tasks |
| **GET** | `/api/tasks/:id` | *None* | Retrieve a single task by ID |
| **POST** | `/api/tasks` | `{"title": "String"}` | Create a new task |
| **PUT** | `/api/tasks/:id` | `{"title": "String"}` | Update an existing task |
| **DELETE** | `/api/tasks/:id` | *None* | Delete a task |

### Sample JSON Request Body for POST / PUT
```json
{
  "title": "Finish Git documentation",
}
```

## 📊 Accessing pgAdmin (Database GUI)

Once the containers are up and running, you can visually explore and manage your PostgreSQL database.

1. Open your web browser and navigate to: **`http://localhost:5050`**
2. Log in using the default container credentials:
   * **Email:** `PGADMIN_EMAIL`
   * **Password:** `PGADMIN_PASSWORD`

### Connecting pgAdmin to the Postgres Container
To see your specific database inside pgAdmin, you must register the server:

1. Right-click on **Servers** -> **Register** -> **Server...**
2. In the **General** tab:
   * Set **Name** to: `CRUD Database` (or any name you prefer)
3. In the **Connection** tab, use these exact settings:
   * **Host name/address:** `postgres_db` *(Crucial: This uses Docker's internal network to find the database service name, do not use localhost here!)*
   * **Port:** `5432`
   * **Maintenance database:** `postgres`
   * **Username:** `DB_USER`
   * **Password:** `DB_PASSWORD`
4. Click **Save**. 

*Ensure the credentials match what is in your .env file*

You can now expand the servers list, find `postgres` under Schemas -> Tables, and run custom SQL queries or monitor your CRUD API's tables.

---

## 🛑 Stopping the Application
To stop and remove all running containers without losing your database volumes, run:
```bash
docker compose down
```
