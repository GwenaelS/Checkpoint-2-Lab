import argon2 from "argon2";
import type { RequestHandler } from "express";

// Import access to data
import userRepository from "./userRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all users
    const users = await userRepository.readAll();

    // Respond with the users in JSON format
    res.status(200).json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific user based on the provided ID
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);

    // If the user is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the user in JSON format
    if (user == null) {
      res.status(404).json({ information: "User not found" });
    } else {
      res.status(200).json(user);
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
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.status(400).json({ information: "Informations incomplete" });
      return;
    }

    // Fetch a specific user based on the provided ID
    const userId = Number(req.params.id);
    if (!userId) {
      res.status(404).json({ information: "You must provide a user" });
      return;
    }

    // Verify if user already exist with an id
    const doesUserExist = await userRepository.read(userId);
    if (!doesUserExist) {
      res.status(404).json({ information: "User not found" });
    }

    // Hash the new password
    const hashPassword = await argon2.hash(req.body.password);

    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    };

    // Update the user
    const updateUser = await userRepository.update(user, userId);
    if (updateUser === 0) {
      res.status(400).json({ information: "Cannot update the user" });
    }

    // Respond with the users in JSON format
    res
      .status(200)
      .json({ information: "User updated successfully", updateUser });
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
      !req.body.username ||
      !req.body.email ||
      !req.body.password
    ) {
      res.status(400).json({ information: "Informations incomplete" });
      return;
    }

    // Verify if user already exist with an email
    const doesUserExist = await userRepository.readEmail(req.body.email);
    if (doesUserExist) {
      res.status(409).json({ information: "User already exist" });
      return;
    }

    // Password hash
    const hashPassword = await argon2.hash(req.body.password);

    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    };

    // Create the user
    const insertId = await userRepository.create(user);
    if (!insertId) {
      res.status(400).json({ information: "Cannot create the user" });
    }

    // Respond with HTTP 201 (Created) and the ID of the newly inserted user
    res.status(201).json({ information: "User created", insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    if (!userId) {
      res.status(400).json({ information: "An user must be provided" });
    }

    const doesUserExist = await userRepository.read(userId);
    if (!doesUserExist) {
      res.status(404).json({ information: "User not found" });
      return;
    }

    const deleteUser = await userRepository.delete(userId);
    if (deleteUser === 0) {
      res.status(400).json({ information: "Cannot delete the user" });
    }

    res.status(204).json({ information: "User deleted", deleteUser });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, edit, add, destroy };
