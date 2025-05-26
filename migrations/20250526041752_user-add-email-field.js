import fs from "node:fs/promises";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const sql = await fs.readFile(
    "migrations/20250526041752_user-add-email-field.up.sql",
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
    "migrations/20250526041752_user-add-email-field.down.sql",
    "utf8"
  );
  return await knex.raw(sql);
}
