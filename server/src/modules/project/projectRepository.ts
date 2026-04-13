import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";
import type { TProject } from "../../types/TProject";

class ProjectRepository {
  // The C of CRUD - Create operation

  async create(project: Omit<TProject, "id" | "created_at">) {
    // Execute the SQL INSERT query to add a new project to the "project" table
    const [result] = await databaseClient.query<Result>(
      "insert into project (title, description, status, created_by) values (?, ?, ?, ?)",
      [project.title, project.description, project.status, project.created_by],
    );

    // Return the ID of the newly inserted project
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific project by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from project where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the project
    return rows[0] as TProject;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all projects from the "project" table
    const [rows] = await databaseClient.query<Rows>("select * from project");

    // Return the array of projects
    return rows as TProject[];
  }

  async readAllProjectByUserId(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT project.* FROM project JOIN user_project ON project.id = user_project.project_id WHERE user_project.user_id = ?",
      [userId],
    );

    return rows as TProject[];
  }

  // The U of CRUD - Update operation

  async update(
    project: Omit<TProject, "id" | "created_at" | "created_by">,
    id: number,
  ) {
    // Execute the SQL UPDATE operation to update a project
    const [result] = await databaseClient.query<Result>(
      "update project set title = ?, description = ?, status = ? where id = ?",
      [project.title, project.description, project.status, id],
    );

    // Return the affected rows after the SQL request
    return result.affectedRows;
  }

  // The D of CRUD - Delete operation

  async delete(id: number) {
    // Execute the SQL DELETE operation to delete a specific project by its ID
    const [result] = await databaseClient.query<Result>(
      "delete from project where id = ?",
      [id],
    );

    // Return the affected rows after the SQL request
    return result.affectedRows;
  }

  async addMember(userId: number, projectId: number) {
    //
    const [result] = await databaseClient.query<Result>(
      "insert into user_project (user_id, project_id) values (?, ?)",
      [userId, projectId],
    );

    return result.affectedRows;
  }
}

export default new ProjectRepository();
