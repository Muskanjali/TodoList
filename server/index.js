const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todo_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    isCompleted: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// API Routes
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
});

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
