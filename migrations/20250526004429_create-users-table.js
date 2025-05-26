import fs from "node:fs/promises";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const sql = await fs.readFile(
    "migrations/20250526004429_create-users-table.up.sql",
    "utf8"
  );
  return await knex.raw(sql);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  const sql = await fs.readFile(
    "migrations/20250526004429_create-users-table.down.sql",
    "utf8"
  );
  return await knex.raw(sql);
}
