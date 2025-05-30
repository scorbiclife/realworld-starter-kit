/**
 * NOTE: We use the connection instead of the pool to guarantee
 * that the statements are executed on the same connection
 * inside a transaction.
 */

/**
 * Wrap and run the given action inside a transaction.
 *
 * @type {import("./transaction").TransactionRunner}
 */
export async function runInTransaction(action, connection, ...args) {
  await connection.query("START TRANSACTION;");
  let result;
  try {
    result = await action(connection, ...args);
  } catch (error) {
    await connection.query("ROLLBACK;");
    throw error;
  }
  await connection.query("COMMIT;");
  return result;
}

/**
 * Wrap and run then rollback the given action inside a transaction.
 *
 * @type {import("./transaction").TransactionRunner}
 */
export async function runAndRollback(action, connection, ...args) {
  await connection.query("START TRANSACTION;");
  let result;
  try {
    result = await action(connection, ...args);
  } catch (error) {
    throw error;
  } finally {
    await connection.query("ROLLBACK;");
  }
  return result;
}
