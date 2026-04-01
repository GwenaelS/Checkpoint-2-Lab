// supertest permet de faire des requetes http (projet API REST)
import supertest from "supertest";

// Import the Express application
import app from "../../src/app";

// Import databaseClient
import databaseClient from "../../database/client";

import type { Result, Rows } from "../../database/client";
import taskRepository from "../../src/modules/task/taskRepository";

// Après chaque test, on dit a jest de nettoyer les données des mocks
// (Mocks qui simule une réponse [dans la plupart des cas ici] de la base de données a une requète query)
afterEach(() => {
  jest.restoreAllMocks();
});

// Describe est un block qui permet de regrouper plusieurs tests

// Dans ce block, on test la route "GET /api/tasks"
// Nous testons alors le comportement du controller qui simule les données du model
describe("GET /api/tasks", () => {
  // Le comportement attendu de ce test est de récupérer toutes les taches existantes
  it("should fetch tasks successfully", async () => {
    // Définition de la réponse attendu par le test
    // Rows car GET = RowDataPacket[]
    const rows = [] as Rows;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "rows"
      .mockImplementation(async () => [rows, []]);

    // Envoie de la requète a la route
    const response = await supertest(app).get("/api/tasks");

    // Attendu du test :
    expect(response.status).toBe(200); // Attendu = réponse 200 (OK)
    expect(response.body).toStrictEqual(rows); // Attendu = corps de la réponse strictement égal a "rows"
  });
});

// Dans ce block, on test la route "GET /api/tasks/:id"
// Nous testons alors le comportement du controller qui simule les données du model
describe("GET /api/tasks/:id", () => {
  // Le comportement attendu de ce test est de récupérer une tache via un id (req.params.id)
  it("should fetch a single tasks successfully", async () => {
    // Définition de la réponse attendu par le test
    // Rows car GET = RowDataPacket[]
    const rows = [{}] as Rows;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "rows"
      .mockImplementation(async () => [rows, []]);

    // Envoie de la requète a la route
    const response = await supertest(app).get("/api/tasks/1");

    // Attendu du test :
    expect(response.status).toBe(200); // Attendu : réponse 200 (OK)
    expect(response.body).toStrictEqual(rows[0]); // Attendu : corps de la réponse strictement égal a "rows" de 0 (premier tableau)
  });

  // Le comportement attendu de ce test est d'échoué de récupérer une tache via un id car l'id n'est pas bon
  it("should fail on invalid id", async () => {
    // Définition de la réponse attendu par le test
    // Rows car GET = RowDataPacket[]
    const rows = [] as Rows;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "rows"
      .mockImplementation(async () => [rows, []]);

    // Envoie de la requète a la route
    const response = await supertest(app).get("/api/tasks/0");

    // Attendu du test :
    expect(response.status).toBe(404); // Attendu : réponse 404 (Not found)
    expect(response.body).toEqual({ information: "Task not found" }); // Attendu : corps de la réponse égal=(compare contenu de l'objet) { information: "Task not found" }
  });
});

// Dans ce block, on test la route "POST /api/tasks"
// Nous testons alors le comportement du controller qui simule les données du model
describe("POST /api/tasks", () => {
  // Le comportement attendu de ce test est de crée une nouvelle tache
  it("should add a new task successfully", async () => {
    // Définition de la réponse attendu par le test
    // Result car !=GET = ResultSetHeader
    const result = { insertId: 3 } as Result;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "result"
      .mockImplementation(async () => [result, []]);

    // Fausse tache que l'on veux crée
    const fakeTask = {
      title: "test",
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Envoie de la requète avec la fausse tache a la route
    const response = await supertest(app).post("/api/tasks").send(fakeTask);

    // Attendu du test :
    expect(response.status).toBe(201); // Attendu : réponse 201 (SUCCESS)
    expect(response.body).toBeInstanceOf(Object); // Attendu : corps de la réponse est un objet
    expect(response.body.insertId).toBe(result.insertId); // Attendu : corps de la réponse insertId est égale result.insertId
  });

  // Le comportement attendu de ce test est d'échoué de crée une nouvelle tache avec un corps de requète mauvaise
  it("should fail on invalid request body", async () => {
    // Définition de la réponse attendu par le test
    // Result car != GET = ResultSetHeader
    const result = { insertId: 3 } as Result;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "result"
      .mockImplementation(async () => [result, []]);

    // Fausse tache que l'on veux crée avec titre manquant
    const fakeTask = {
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Envoie de la requète avec la fausse tache a la route
    const response = await supertest(app).post("/api/tasks").send(fakeTask);

    // Attendu du test :
    expect(response.status).toBe(400); // Attendu : réponse 400 (BAD REQUEST)
    expect(response.body).toEqual({ information: "Informations incomplete" }); // Attendu : corps de la réponse égal=(compare contenu de l'objet) { information: "Informations incomplete" }
  });
});

// Dans ce block, on test la route "PUT /api/tasks/:id"
// Nous testons alors le comportement du controller qui simule les données du model
describe("PUT /api/tasks/:id", () => {
  // Le comportement attendu de ce test est de modifié une tache
  it("should update an existing task successfully", async () => {
    // Comme le controller utilise la méthode "read" (qui fait appel a la base de données) je dois simuler la réponse de cette requète aussi
    // Création d'un espion qui écoute la requète "read" sur le modèle "taskRepository"
    jest.spyOn(taskRepository, "read").mockResolvedValue({
      id: 5,
      title: "Task 4 - P1 EDITED",
      description: "... EDITED",
      status: "In Progress",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      user_id: 1,
      project_id: 2,
    });

    // Définition de la réponse attendu par le test
    // Result car !=GET = ResultSetHeader
    const result = { affectedRows: 1 } as Result;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "result"
      .mockImplementation(async () => [result, []]);

    // Fausse tache que l'on veux modifié
    const fakeTask = {
      title: "Task 5 - P1 EDITED",
      description: "... EDITED",
      status: "In Progress",
      user_id: "1",
    };

    // Envoie de la requète avec la fausse tache a la route
    const response = await supertest(app).put("/api/tasks/2").send(fakeTask);

    // Attendu du test :
    expect(response.status).toBe(204); // Attendu : réponse 204 (NO CONTENT)
    expect(response.body).toEqual({}); // Attendu : corps de la réponse égal=(compare contenu de l'objet) {}
  });

  // Le comportement attendu de ce test est d'échoué a crée une nouvelle tache a cause d'un corps de requète mauvais
  it("should fail on invalid request body", async () => {
    // Définition de la réponse attendu par le test
    // Result car !=GET = ResultSetHeader
    const result = { affectedRows: 1 } as Result;

    // Pas besoin de tester "read" car le test de la rèquete survient d'abord dans le controller

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "result"
      .mockImplementation(async () => [result, []]);

    // Fausse tache que l'on veux crée avec titre manquant
    const fakeTask = {
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Envoie de la requète avec la fausse tache a la route
    const response = await supertest(app).put("/api/tasks/2").send(fakeTask);

    // Attendu du test :
    expect(response.status).toBe(400); // Attendu : réponse 400 (BAD REQUEST)
    expect(response.body).toEqual({ information: "Informations incomplete" }); // Attendu : corps de la réponse égal=(compare contenu de l'objet) { information: "Informations incomplete" }
  });

  // Le comportement attendu de ce test est d'échoué a crée une nouvelle tache due a un ID mauvais
  it("should fail on invalid id", async () => {
    // Définition de la réponse attendu par le test
    // Result car !=GET = ResultSetHeader
    const result = { affectedRows: 0 } as Result;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "result"
      .mockImplementation(async () => [result, []]);

    // Fausse tache que l'on veux crée
    const fakeTask = {
      title: "test",
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Envoie de la requète avec la fausse tache a la route
    const response = await supertest(app).put("/api/tasks/43").send(fakeTask);

    // Attendu du test :
    expect(response.status).toBe(404); // Attendu : réponse 404 (NOT FOUND)
    expect(response.body).toEqual({ information: "Task not found" }); // Attendu : corps de la réponse égal=(compare contenu de l'objet) { information: "Task not found" }
  });
});

// Dans ce block, on test la route "POST /api/tasks/:id"
// Nous testons alors le comportement du controller qui simule les données du model
describe("DELETE /api/tasks/:id", () => {
  // Le comportement attendu de ce test est de supprimer une tache
  it("should delete an existing task successfully", async () => {
    // Comme le controller utilise la méthode "read" (qui fait appel a la base de données) je dois simuler la réponse de cette requète aussi
    // Création d'un espion qui écoute la requète "read" sur le modèle "taskRepository"
    jest.spyOn(taskRepository, "read").mockResolvedValue({
      id: 5,
      title: "Task 4 - P1 EDITED",
      description: "... EDITED",
      status: "In Progress",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      user_id: 1,
      project_id: 2,
    });

    // Définition de la réponse attendu par le test
    // Result car !=GET = ResultSetHeader
    const result = { affectedRows: 1 } as Result;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "result"
      .mockImplementation(async () => [result, []]);

    // Envoie de la requète avec la fausse tache a la route
    const response = await supertest(app).delete("/api/tasks/1");

    // Attendu du test :
    expect(response.status).toBe(204); // Attendu : réponse 204 (NO CONTENT)
    expect(response.body).toEqual({}); // Attendu : corps de la réponse égal=(compare contenu de l'objet) {}
  });

  // Le comportement attendu de ce test est d'échoué a supprimer une tache due a un mauvais ID
  it("should fail on invalid id", async () => {
    // Définition de la réponse attendu par le test
    // Result car !=GET = ResultSetHeader
    const result = { affectedRows: 0 } as Result;

    jest
      // Création d'un éspion qui écoute les requète de type "query" faites sur "databaseClient"
      .spyOn(databaseClient, "query")
      // Simule la réponse de la base de données en renvoyant les données "result"
      .mockImplementation(async () => [result, []]);

    // Envoie de la requète avec la fausse tache a la route
    const response = await supertest(app).delete("/api/tasks/43");

    // Attendu du test :
    expect(response.status).toBe(404); // Attendu : réponse 404 (NOT FOUND)
    expect(response.body).toEqual({ information: "Task not found" }); // Attendu : corps de la réponse égal=(compare contenu de l'objet) { information: "Task not found" }
  });
});
