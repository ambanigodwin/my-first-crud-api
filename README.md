# Task Manager API

A lightweight, local-memory REST API built with Node.js and Express to manage tasks. 

> ⚠️ **Note:** This project uses **in-memory storage** (`local memory`). Any data created, updated, or deleted will reset whenever the server restarts.

## Prerequisites

Ensure you have the following tools installed on your local machine:
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

## Getting Started

Follow these steps to set up and run the API locally.

### 1. Clone the Repository
```bash
git clone https://github.com
cd task-manager-api
```

### 2. Install Dependencies
```bash
npm install express swagger-ui-express
```

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

## Tech Stack

* **Node.js** - JavaScript runtime environment
* **Express** - Minimalist web framework
* **In-Memory Arrays** - Temporal runtime data storage
