import type { RequestHandler } from "express";

// Import access to data
import taskRepository from "./taskRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all tasks
    const tasks = await taskRepository.readAll();

    // Respond with the tasks in JSON format
    res.status(200).json(tasks);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific task based on the provided ID
    const taskId = Number(req.params.id);
    const task = await taskRepository.read(taskId);

    // If the task is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the task in JSON format
    if (task == null) {
      res.status(404).json({ information: "Task not found" });
    } else {
      res.status(200).json(task);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit: RequestHandler = async (req, res, next) => {
  try {
    // Verify if there is a request, and informations within
    if (!req.body) {
      res.status(400).json({ information: "Informations incomplete" });
      return;
    }

    // Only for PUT changes (modify later on PATCH)
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.status ||
      !req.body.user_id
    ) {
      res.status(400).json({ information: "Informations incomplete" });
      return;
    }

    // Fetch a specific task based on the provided ID
    const taskId = Number(req.params.id);
    if (!taskId) {
      res.status(404).json({ information: "You must provide a task" });
      return;
    }

    // Verify if task already exist with an id
    const doesTaskExist = await taskRepository.read(taskId);
    if (!doesTaskExist) {
      res.status(404).json({ information: "Task not found" });
      return;
    }

    const task = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      user_id: req.body.user_id,
    };

    // Update the task
    const updateTask = await taskRepository.update(task, taskId);
    if (updateTask === 0) {
      res.status(400).json({ information: "Cannot update the task" });
      return;
    }

    // Respond with the tasks in JSON format
    res
      .status(200)
      .json({ information: "Task updated successfully", updateTask });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Verify if there is a request and the fields are all present
    if (
      !req.body ||
      !req.body.title ||
      !req.body.description ||
      !req.body.status ||
      !req.body.user_id ||
      !req.body.project_id
    ) {
      res.status(400).json({ information: "Informations incomplete" });
      return;
    }

    const task = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      user_id: req.body.user_id,
      project_id: req.body.project_id,
    };

    // Create the task
    const insertId = await taskRepository.create(task);
    if (!insertId) {
      res.status(400).json({ information: "Cannot create the task" });
      return;
    }

    // Respond with HTTP 201 (Created) and the ID of the newly inserted task
    res.status(201).json({ information: "Task created", insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (!taskId) {
      res.status(400).json({ information: "An task must be provided" });
      return;
    }

    const doesTaskExist = await taskRepository.read(taskId);
    if (!doesTaskExist) {
      res.status(404).json({ information: "Task not found" });
      return;
    }

    const deleteTask = await taskRepository.delete(taskId);
    if (deleteTask === 0) {
      res.status(400).json({ information: "Cannot delete the task" });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, edit, add, destroy };
