// Import the supertest library for making HTTP requests
import supertest from "supertest";

// Import the Express application
import app from "../../src/app";

// Import databaseClient
import databaseClient from "../../database/client";

import type { Result, Rows } from "../../database/client";
import projectRepository from "../../src/modules/project/projectRepository";

// Restore all mocked functions after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Test suite for the GET /api/projects route
describe("GET /api/projects", () => {
  it("should fetch projects successfully", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/projects endpoint
    const response = await supertest(app).get("/api/projects");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows);
  });
});

// Test suite for the GET /api/projects/:id route
describe("GET /api/projects/:id", () => {
  it("should fetch a single projects successfully", async () => {
    // Mock rows returned from the database
    const rows = [{}] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/projects/:id endpoint
    const response = await supertest(app).get("/api/projects/1");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows[0]);
  });

  it("should fail on invalid id", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/projects/:id endpoint with an invalid ID
    const response = await supertest(app).get("/api/projects/100");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ information: "Project not found" });
  });
});

// Test suite for the POST /api/projects route
describe("POST /api/projects", () => {
  it("should add a new project successfully", async () => {
    // Mock result of the database query
    const result = { insertId: 3 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake project data
    const fakeProject = {
      id: 1,
      title: "Project 1",
      description: "Description for Project 1",
      status: "To Do",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      created_by: 1,
    };

    // Send a POST request to the /api/projects endpoint with a test project
    const response = await supertest(app)
      .post("/api/projects")
      .send(fakeProject);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.insertId).toBe(result.insertId);
  });

  it("should fail on invalid request body", async () => {
    // Mock result of the database query
    const result = { insertId: 3 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake project data with missing title
    const fakeProject = {
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Send a POST request to the /api/projects endpoint with a test project
    const response = await supertest(app)
      .post("/api/projects")
      .send(fakeProject);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ information: "Informations incomplete" });
  });
});

// Test suite for the PUT /api/projects/:id route
describe("PUT /api/projects/:id", () => {
  it("should update an existing project successfully", async () => {
    // 1. Mock the 'read' method so the existence check passes
    jest.spyOn(projectRepository, "read").mockResolvedValue({
      id: 1,
      title: "Project 1",
      description: "Description for Project 1",
      status: "To Do",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      created_by: 1,
    }); // Mocking a found project

    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake project data
    const fakeProject = {
      id: 1,
      title: "Project 1",
      description: "Description for Project 1",
      status: "To Do",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      created_by: 1,
    };

    // Send a PUT request to the /api/projects/:id endpoint with a test project
    const response = await supertest(app)
      .put("/api/projects/2")
      .send(fakeProject);

    // Assertions
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should fail on invalid request body", async () => {
    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake project data with missing title
    const fakeProject = {
      id: 1,
      description: "Description for Project 1",
      status: "To Do",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      created_by: 1,
    };

    // Send a PUT request to the /api/projects/:id endpoint with a test project
    const response = await supertest(app)
      .put("/api/projects/2")
      .send(fakeProject);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ information: "Informations incomplete" });
  });

  it("should fail on invalid id", async () => {
    // Mock result of the database query
    const result = { affectedRows: 0 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake project data
    const fakeProject = {
      id: 1,
      title: "Project 1",
      description: "Description for Project 1",
      status: "To Do",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      created_by: 1,
    };

    // Send a PUT request to the /api/projects/:id endpoint with a test project
    const response = await supertest(app)
      .put("/api/projects/43")
      .send(fakeProject);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ information: "Project not found" });
  });
});

// Test suite for the DELETE /api/projects/:id route
describe("DELETE /api/projects/:id", () => {
  it("should delete an existing project successfully", async () => {
    // 1. Mock the 'read' method so the existence check passes
    jest.spyOn(projectRepository, "read").mockResolvedValue({
      id: 1,
      title: "Project 1",
      description: "Description for Project 1",
      status: "To Do",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      created_by: 1,
    }); // Mocking a found project

    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Send a DELETE request to the /api/projects/:id endpoint
    const response = await supertest(app).delete("/api/projects/42");

    // Assertions
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should fail on invalid id", async () => {
    // Mock result of the database query
    const result = { affectedRows: 0 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Send a DELETE request to the /api/projects/:id endpoint
    const response = await supertest(app).delete("/api/projects/43");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ information: "Project not found" });
  });
});
