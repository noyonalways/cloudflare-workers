import { ConflictError, NotFoundError } from "../errors/http.error";
import type { CreateUserInput, UpdateUserInput, User } from "../types/user";

const USER_COLUMNS = "id, username, email, created_at, updated_at";

export class UserService {
  constructor(private readonly db: D1Database) {}

  async list(): Promise<User[]> {
    const { results } = await this.db
      .prepare(`SELECT ${USER_COLUMNS} FROM users ORDER BY id ASC`)
      .all<User>();

    return results;
  }

  async getById(id: number): Promise<User> {
    const user = await this.db
      .prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`)
      .bind(id)
      .first<User>();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async create(input: CreateUserInput): Promise<User> {
    try {
      const user = await this.db
        .prepare(
          `INSERT INTO users (username, email)
           VALUES (?, ?)
           RETURNING ${USER_COLUMNS}`
        )
        .bind(input.username, input.email)
        .first<User>();

      if (!user) {
        throw new Error("Failed to create user");
      }

      return user;
    } catch (error) {
      this.rethrowUniqueConstraint(error);
    }
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    await this.getById(id);

    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (input.username !== undefined) {
      fields.push("username = ?");
      values.push(input.username);
    }

    if (input.email !== undefined) {
      fields.push("email = ?");
      values.push(input.email);
    }

    try {
      const user = await this.db
        .prepare(
          `UPDATE users SET ${fields.join(", ")}
           WHERE id = ?
           RETURNING ${USER_COLUMNS}`
        )
        .bind(...values, id)
        .first<User>();

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    } catch (error) {
      this.rethrowUniqueConstraint(error);
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.db
      .prepare("DELETE FROM users WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      throw new NotFoundError("User not found");
    }
  }

  private rethrowUniqueConstraint(error: unknown): never {
    if (
      error instanceof Error &&
      /UNIQUE constraint failed/i.test(error.message)
    ) {
      throw new ConflictError("Username or email already exists");
    }

    throw error;
  }
}
