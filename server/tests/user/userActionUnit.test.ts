import type { NextFunction, Request, Response } from "express";
import userActions from "../../src/modules/user/userActions";
import userRepository from "../../src/modules/user/userRepository";

jest.mock("../../src/modules/user/userRepository.ts");

describe("UserActions ==> Create a new user", () => {
  it("Should create a new user successfully", async () => {
    // Fake data
    const newUser = {
      username: "JulesPasseDemain",
      email: "OnLeDiraAYoussef@gmail.com",
      password: "OnOublieraPas",
    };
    const insertId = 54;

    // Notre controller demande en params (req, res, next)
    // Donc on simule leur data
    const req = {
      body: {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next = jest.fn().mockReturnThis() as NextFunction;

    // Puisque dans mon controller j'appelle une autre méthode qui vérifie si l'email est déja présente en BDD
    (userRepository.readEmail as jest.Mock).mockResolvedValue(false);

    // Quand on simule la création, on retourne newUser
    (userRepository.create as jest.Mock).mockResolvedValue(insertId);

    await userActions.add(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      information: "User created",
      insertId,
    });
  });
});
