// Import the supertest library for making HTTP requests
import supertest from "supertest";

// Import the Express application
import app from "../../src/app";

// Import databaseClient
import databaseClient from "../../database/client";

import type { Result, Rows } from "../../database/client";
import taskRepository from "../../src/modules/task/taskRepository";

// Restore all mocked functions after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Test suite for the GET /api/tasks route
describe("GET /api/tasks", () => {
  it("should fetch tasks successfully", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/tasks endpoint
    const response = await supertest(app).get("/api/tasks");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows);
  });
});

// Test suite for the GET /api/tasks/:id route
describe("GET /api/tasks/:id", () => {
  it("should fetch a single tasks successfully", async () => {
    // Mock rows returned from the database
    const rows = [{}] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/tasks/:id endpoint
    const response = await supertest(app).get("/api/tasks/1");

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

    // Send a GET request to the /api/tasks/:id endpoint with an invalid ID
    const response = await supertest(app).get("/api/tasks/0");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ information: "Task not found" });
  });
});

// Test suite for the POST /api/tasks route
describe("POST /api/tasks", () => {
  it("should add a new task successfully", async () => {
    // Mock result of the database query
    const result = { insertId: 3 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake task data
    const fakeTask = {
      title: "test",
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Send a POST request to the /api/tasks endpoint with a test task
    const response = await supertest(app).post("/api/tasks").send(fakeTask);

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

    // Fake task data with missing title
    const fakeTask = {
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Send a POST request to the /api/tasks endpoint with a test task
    const response = await supertest(app).post("/api/tasks").send(fakeTask);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ information: "Informations incomplete" });
  });
});

// Test suite for the PUT /api/tasks/:id route
describe("PUT /api/tasks/:id", () => {
  it("should update an existing task successfully", async () => {
    // 1. Mock the 'read' method so the existence check passes
    jest.spyOn(taskRepository, "read").mockResolvedValue({
      id: 5,
      title: "Task 4 - P1 EDITED",
      description: "... EDITED",
      status: "In Progress",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      user_id: 1,
      project_id: 2,
    }); // Mocking a found task

    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake task data
    const fakeTask = {
      title: "Task 5 - P1 EDITED",
      description: "... EDITED",
      status: "In Progress",
      user_id: "1",
    };

    // Send a PUT request to the /api/tasks/:id endpoint with a test task
    const response = await supertest(app).put("/api/tasks/2").send(fakeTask);

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

    // Fake task data with missing title
    const fakeTask = {
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Send a PUT request to the /api/tasks/:id endpoint with a test task
    const response = await supertest(app).put("/api/tasks/2").send(fakeTask);

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

    // Fake task data
    const fakeTask = {
      title: "test",
      description: "test@gmail.com",
      status: "To Do",
      user_id: "1",
      project_id: "1",
    };

    // Send a PUT request to the /api/tasks/:id endpoint with a test task
    const response = await supertest(app).put("/api/tasks/43").send(fakeTask);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ information: "Task not found" });
  });
});

// Test suite for the DELETE /api/tasks/:id route
describe("DELETE /api/tasks/:id", () => {
  it("should delete an existing task successfully", async () => {
    // 1. Mock the 'read' method so the existence check passes
    jest.spyOn(taskRepository, "read").mockResolvedValue({
      id: 5,
      title: "Task 4 - P1 EDITED",
      description: "... EDITED",
      status: "In Progress",
      created_at: new Date("2026-03-27T14:19:22.000Z"),
      user_id: 1,
      project_id: 2,
    }); // Mocking a found task

    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Send a DELETE request to the /api/tasks/:id endpoint
    const response = await supertest(app).delete("/api/tasks/42");

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

    // Send a DELETE request to the /api/tasks/:id endpoint
    const response = await supertest(app).delete("/api/tasks/43");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ information: "Task not found" });
  });
});
