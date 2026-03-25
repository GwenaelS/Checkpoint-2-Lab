import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";
import type { TTask } from "../../types/TTask";

class TaskRepository {
  // The C of CRUD - Create operation

  async create(task: Omit<TTask, "id" | "created_at">) {
    // Execute the SQL INSERT query to add a new task to the "task" table
    const [result] = await databaseClient.query<Result>(
      "insert into task (title, description, status, user_id, project_id) values (?, ?, ?, ?, ?)",
      [
        task.title,
        task.description,
        task.status,
        task.user_id,
        task.project_id,
      ],
    );

    // Return the ID of the newly inserted task
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific task by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from task where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the task
    return rows[0] as TTask;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all tasks from the "task" table
    const [rows] = await databaseClient.query<Rows>("select * from task");

    // Return the array of talks
    return rows as TTask[];
  }

  // The U of CRUD - Update operation

  async update(
    task: Omit<TTask, "id" | "created_at" | "project_id">,
    id: number,
  ) {
    // Execute the SQL UPDATE operation to update a task
    const [result] = await databaseClient.query<Result>(
      "update task set title = ?, description = ?, status = ?, user_id = ? where id = ?",
      [task.title, task.description, task.status, task.user_id, id],
    );

    // Return the affected rows after the SQL request
    return result.affectedRows;
  }

  // The D of CRUD - Delete operation

  async delete(id: number) {
    // Execute the SQL DELETE operation to delete a specific task by its ID
    const [result] = await databaseClient.query<Result>(
      "delete from task where id = ?",
      [id],
    );

    // Return the affected rows after the SQL request
    return result.affectedRows;
  }
}

export default new TaskRepository();
