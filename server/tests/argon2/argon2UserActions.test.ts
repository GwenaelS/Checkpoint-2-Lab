import type { NextFunction, Request, Response } from "express";
import userActions from "../../src/modules/user/userActions";
import userRepository from "../../src/modules/user/userRepository";

// On mock (simule) le model car on ne veux pas réellement communiquer avec la bdd
// On définira nous même le resultat attendu lors de l'appel de celui ci
jest.mock("../../src/modules/user/userRepository");

describe("GET /api/users", () => {
  it("Should return all users", async () => {
    // Définition du résultat attendu final du controller
    const fakeUserList = [
      {
        username: "1",
        email: "1@gmail.com",
        password: "12345",
      },
      {
        username: "2",
        email: "2@gmail.com",
        password: "12345",
      },
    ];

    // Le controller attend (req, res, next)
    // Le controller a la méthode BROWSE n'utilise pas req, mais attends quand même req
    const req = {} as unknown as Request; // ?????

    // Le controller renvoie un status
    // Le controller renvoie une réponse en json
    const res = {
      status: jest.fn().mockReturnThis(),
      // res.status() => status est une fonction donc on simule une fonction avec jest.fn()
      // Puis avec mockReturnThis() on retourne l'objet de la fonction (se retourne lui même)
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    // Le controller utilise Next pour la gestion d'erreur
    const next = jest.fn() as unknown as NextFunction; // ?????

    // Lors de l'appel du model, on veut que le resultat soit défini en "FakeUserList"
    (userRepository.readAll as jest.Mock).mockResolvedValue(fakeUserList);

    // Execution du controller
    await userActions.browse(req, res, next);

    // Attendu du test
    expect(res.status).toHaveBeenCalledWith(200); // Status === 200 (SUCCESS)
    expect(res.json).toHaveBeenCalledWith(fakeUserList); // Data JSON === fakeUserList
  });
});
