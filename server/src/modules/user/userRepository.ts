import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
};

class UserRepository {
  // The C of CRUD - Create operation

  async create(user: Omit<User, "id" | "created_at">) {
    // Execute the SQL INSERT query to add a new user to the "user" table
    const [result] = await databaseClient.query<Result>(
      "insert into user (username, email, password) values (?, ?, ?)",
      [user.username, user.email, user.password],
    );

    // Return the ID of the newly inserted user
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific user by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from user where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the user
    return rows[0] as User;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all users from the "user" table
    const [rows] = await databaseClient.query<Rows>("select * from user");

    // Return the array of users
    return rows as User[];
  }

  async readEmail(email: string) {
    // Execute the SQL SELECT query to retrieve a specific user by its email
    const [rows] = await databaseClient.query<Rows>(
      "select * from user where email = ?",
      [email],
    );

    // Return the first row of the result, which represents the user
    return rows[0] as User;
  }

  // The U of CRUD - Update operation

  async update(user: User) {
    // Execute the SQL UPDATE operation to modify an existing user
    const [result] = await databaseClient.query<Result>(
      "update user set username = ?, email = ?, password = ? where id = ?",
      [user.username, user.email, user.password, user.id],
    );

    // Return the affected rows after the SQL request
    return result.affectedRows;
  }

  // The D of CRUD - Delete operation

  async delete(id: number) {
    // Execute the SQL DELETE operation to delete a specific user by its id
    const [result] = await databaseClient.query<Result>(
      "delete from user where id = ?",
      [id],
    );

    // Return the affected rows after the SQL request
    return result.affectedRows;
  }
}

export default new UserRepository();
