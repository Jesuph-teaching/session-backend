const express = require("express");
const todoRouter = express.Router();
const Todo = require("../models/todo");
const { z } = require("zod");

const creatingTodoSchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
});

todoRouter
  .route("/")
  .post(async (req, res) => {
    const result = creatingTodoSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);
    const user = req.user;
    try {
      const todo = new Todo({
        title: result.data.title,
        description: result.data.description,
        dueDate: new Date(result.data.dueDate),
        user: user._id,
      });
      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .get(async (req, res) => {
    const user = req.user;
    try {
      const todos = await Todo.find({ user: user._id });
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
todoRouter.put("/:id/complete", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { isCompleted: true },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
todoRouter.put("/:id/uncomplete", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { isCompleted: false },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
todoRouter
  .route("/:id")
  .get(async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      const user = req.user;
      if (!todo) return res.status(404).json({ error: "Todo not found" });
      if (todo.user.toString() !== user._id.toString())
        return res.status(403).json({ error: "Unauthorized" });

      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    const result = creatingTodoSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);
    try {
      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        {
          title: result.data.title,
          description: result.data.description,
          dueDate: new Date(result.data.dueDate),
        },
        { new: true }
      );
      if (!todo) return res.status(404).json({ error: "Todo not found" });
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) return res.status(404).json({ error: "Todo not found" });
      res.json({ message: "Todo deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = todoRouter;
