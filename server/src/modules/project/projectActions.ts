import type { RequestHandler } from "express";

import type { AuthRequest } from "../../middlewares/verifyToken";
// Import access to data
import projectRepository from "./projectRepository";

// The B of BREAD - Browse (Read All) operation
const browseAdmin: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all projects
    const projects = await projectRepository.readAll();

    // Respond with the projects in JSON format
    res.status(200).json(projects);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const browseUser: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const user = req.user;
    const userId = req.user?.id;
    if (!user || !userId) {
      res.status(400).json({ information: "User not found" });
      return;
    }

    const userProject = await projectRepository.readAllProjectByUserId(userId);
    res.status(200).json({ userProject });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific project based on the provided ID
    const projectId = Number(req.params.id);
    const project = await projectRepository.read(projectId);

    // If the project is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the project in JSON format
    if (project == null) {
      res.status(404).json({ information: "Project not found" });
    } else {
      res.status(200).json(project);
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
    if (!req.body.title || !req.body.description || !req.body.status) {
      res.status(400).json({ information: "Informations incomplete" });
      return;
    }

    // Fetch a specific project based on the provided ID
    const projectId = Number(req.params.id);
    if (!projectId) {
      res.status(404).json({ information: "You must provide a project" });
      return;
    }

    // Verify if project already exist with an id
    const doesProjectExist = await projectRepository.read(projectId);
    if (!doesProjectExist) {
      res.status(404).json({ information: "Project not found" });
      return;
    }

    const project = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };

    // Update the project
    const updateProject = await projectRepository.update(project, projectId);
    if (updateProject === 0) {
      res.status(400).json({ information: "Cannot update the project" });
      return;
    }

    // Respond with the projects in JSON format
    res
      .status(204)
      .json({ information: "Project updated successfully", updateProject });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    // Fetch a specific user based on the token ID
    const user = req.user;
    const userId = req.user?.id;
    if (!user || !userId) {
      res.status(404).json({ information: "User not found" });
      return;
    }

    // Verify if there is a request and the fields are all present
    if (
      !req.body ||
      !req.body.title ||
      !req.body.description ||
      !req.body.status
    ) {
      res.status(400).json({ information: "Informations incomplete" });
      return;
    }

    const project = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      created_by: userId,
    };

    // Create the project
    const insertId = await projectRepository.create(project);
    if (!insertId) {
      res.status(400).json({ information: "Cannot create the project" });
      return;
    }

    const addMember = await projectRepository.addMember(userId, insertId);
    if (!addMember) {
      res.status(400).json({ information: "Cannot create the project" });
      return;
    }

    // Respond with HTTP 201 (Created) and the ID of the newly inserted project
    res.status(201).json({ information: "Project created", insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    if (!projectId) {
      res.status(400).json({ information: "An project must be provided" });
      return;
    }

    const doesProjectExist = await projectRepository.read(projectId);
    if (!doesProjectExist) {
      res.status(404).json({ information: "Project not found" });
      return;
    }

    const deleteProject = await projectRepository.delete(projectId);
    if (deleteProject === 0) {
      res.status(400).json({ information: "Cannot delete the project" });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browseAdmin, browseUser, read, edit, add, destroy };
