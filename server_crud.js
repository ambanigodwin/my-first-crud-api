const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const Database = require('better-sqlite3');
const PORT = 3000;

// Middleware to allow our app to read incoming JSON in requests
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Connect to SQLite database
const db = new Database('tasks.db');
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done BOOLEAN DEFAULT FALSE
    )
`);

// Insert initial seed data only if table is empty
const rowCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
if (rowCount.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run("Task 1", "true");
  insert.run("Task 2", "false");
  insert.run("Task 3", "false");
}

// 1. Endpoint to describe the API
app.get('/api/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    res.json({ 
        apiName: "Task Management Express API v1.1",
        data: tasks
     });
});

// 2. Endpoint to return server health status
app.get('/api/health', (req, res) => {
    res.json({ "status": "OK"});
});

app.get('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    const foundTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

    if (foundTask) {
        res.json(foundTask);
    } else {
        // HTTP status 404 means "Not Found"
        res.status(404).json({ error: `Task ${taskId} not found` });
    }
});

// 3. Endpoint to CREATE a new task
app.post('/api/tasks', (req, res) => {
    // Read the title sent in the request body
    const { title } = req.body;

    // Simple validation: check if title is missing
    if (!title) {
        return res.status(400).json({ error: "Please provide task title" });
    }

    // Generate a new ID (take the last task's ID and add 1)
    const statement = db.prepare('INSERT INTO tasks (title) VALUES (?)');
    const result = statement.run(title);

    const newTask = {
        id: result.lastInsertRowid,
        title: title,
        done: "false"
    };

    // Return status 201 (Created) along with the newly created task
    res.status(201).json(newTask);
});

// 4. UPDATE (PUT)
app.put('/api/tasks/:id', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Please provide a task title to update" });
    }

    const statement = db.prepare('UPDATE tasks SET title = ? WHERE id = ?');
    const result = statement.run(title, req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.json({ id: Number(req.params.id), title, done: "false" });
});

// 5. DELETE
app.delete('/api/tasks/:id', (req, res) => {
    const statement = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = statement.run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});