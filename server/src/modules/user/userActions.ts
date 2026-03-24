import type { RequestHandler } from "express";

// Import access to data
import userRepository from "./userRepository";
// import { User } from "./IUser";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all users
    const users = await userRepository.readAll();

    // Respond with the users in JSON format
    res.json(users);
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
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the user data from the request body
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    const doesUserExist = await userRepository.readEmail(newUser.email);
    if (!doesUserExist) {
      // Create the user
      const insertId = await userRepository.create(newUser);

      // Respond with HTTP 201 (Created) and the ID of the newly inserted user
      res.status(201).json({ insertId });
    } else {
      res.sendStatus(409);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const doesUserExist = await userRepository.read(userId);

    if (!doesUserExist) {
      res.sendStatus(404);
      return;
    }

    const deleteUser = await userRepository.delete(userId);

    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, add, destroy };
