const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const PORT = 3000;

// Middleware to allow our app to read incoming JSON in requests
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const tasks = [
    { id: 1, title: "Task 1", done: "true" },
    { id: 2, title: "Task 2", done: "false" },
    { id: 3, title: "Task 3", done: "false" }
];

// 1. Endpoint to describe the API
app.get('/api/tasks', (req, res) => {
    res.json({ 
        apiName: "Task Management Express API v1.0",
        count: tasks.length,
        data: tasks
     });
});

// 2. Endpoint to return server health status
app.get('/api/health', (req, res) => {
    res.json({ "status": "OK"});
});

app.get('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    const foundTask = tasks.find(t => t.id === taskId);

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
    const UserTitle= req.body;

    // Simple validation: check if title or author is missing
    if (!UserTitle) {
        return res.status(400).json({ error: "Please provide task title" });
    }

    // Generate a new ID (take the last book's ID and add 1)
    const newTask = {
        id: tasks.length + 1,
        title: UserTitle,
        done: "false"
    };

    // Save to our array
    tasks.push(newTask);

    // Return status 201 (Created) along with the newly created book
    res.status(201).json(newTask);
});

// 4. UPDATE (PUT)
app.put('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    const title = req.body;
    if (!title) {
        return res.status(400).json({ error: "Please provide a title to update" });
    }

    task.title = title;
    task.done = req.body.done || "false";

 
    res.json(task);
});

// 5. DELETE
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    // Remove 1 item at taskIndex
    tasks.splice(taskIndex, 1);

    // 204 No Content means success, but no data to return
    res.status(204).send();
});



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});