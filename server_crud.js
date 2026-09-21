require('dotenv').config();
const express = require('express');
const PostgresTaskRepository = require('./repositories/postgresTaskRepository');
const app = express();
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

// Middleware to allow our app to read incoming JSON in requests
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Instantiate repository
const taskRepo = new PostgresTaskRepository();
taskRepo.init().catch(console.error);

// 1. READ ALL
app.get('/api/tasks', async (req, res) => {
  const tasks = await taskRepo.getAll();
  res.json(tasks);
});

// 2. CREATE
app.post('/api/tasks', async (req, res) => {
  const { title, completed } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = await taskRepo.create(title, completed);
  res.status(201).json(newTask);
});

// 3. READ ONE BY ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    // 1. Extract the ID from the URL parameters
    const { id } = req.params;

    // 2. Call the repository method
    const task = await taskRepo.getById(id);

    // 3. Handle case where task doesn't exist
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // 4. Return the found task
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a task by ID
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const updatedTask = await taskRepo.update(id, title, completed);

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//4. DELETE TASK BY ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Call the repository method to delete the row in Postgres
    const deleted = await taskRepo.delete(id);

    // If no row was affected, the task didn't exist
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    // 204 No Content for a successful deletion
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});