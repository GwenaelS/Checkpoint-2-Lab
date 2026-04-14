import supertest from "supertest";
import databaseClient, { type Result } from "../../database/client";
import app from "../../src/app";

jest.mock("../../src/modules/user/userRepository.ts");

describe("POST userActions/api/users", () => {
  it("Should create a new user successfully", async () => {
    const fakeUser = {
      username: "JulesPasseDemain",
      email: "OnLeDiraAYoussef@gmail.com",
      password: "OnOublieraPas",
    };
    const insertId = { insertId: 1 } as Result;

    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [insertId, []]);

    const response = await supertest(app).post("/api/users").send(fakeUser);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      information: "User created",
      insertId,
    });
  });
});
