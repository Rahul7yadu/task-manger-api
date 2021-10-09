const express = require("express");
const Tasks = require("../models/tasks");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  console.log(req.user);
  const task = new Tasks({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.send(task).status(201);
  } catch (e) {
    res.send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // const task = await Tasks.find({ owner: req.user._id });
    const match = {};
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    // const options = {};
    // if (req.query.limit) {
    //   options.limit = parseInt(req.query.limit);
    //   options.skip = parseInt(req.query.skip);
    // }

    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit) || null,
        skip: parseInt(req.query.skip) || null,
        sort,
      },
    });
    console.log("from task/router");
    if (!req.user.tasks) {
      return res.status(404);
    }
    res.send(req.user.tasks);
  } catch (e) {
    res.send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Tasks.findById(_id);
    const task = await Tasks.find({ _id: _id, owner: req.user._id });
    if (task === []) {
      console.log("working");
      return res.send({ error: "wrong id for the current user" });
    }
    console.log(task);
    res.send(task);
  } catch (e) {
    res.send(e).status(400);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const validUpdates = ["description", "completed"];

  const isUpdateValid = updates.every((update) =>
    validUpdates.includes(update)
  );
  if (!isUpdateValid) {
    return res.status(404).send({ error: "updates not allowed" });
  }

  try {
    const task = await Tasks.findOne({ _id: _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send({ error: "no tast with that id found" });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const deltedTask = await Tasks.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deltedTask) {
      return res.status(404).send();
    }
    res.send(deltedTask);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
