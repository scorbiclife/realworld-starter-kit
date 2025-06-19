import logger from "#src/logger/index.js";

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
  try {
    const result = await action(connection, ...args);
    await connection.query("COMMIT;");
    return result;
  } catch (error) {
    await connection.query("ROLLBACK;");
    logger.logError(error, {
      message: "Transaction failed in runInTransaction",
    });
    // it's okay to throw because this is just a wrapper
    throw error;
  }
}

/**
 * @type {import("./transaction").TransactionRunner}
 */
export async function runAndRollback(action, connection, ...args) {
  await connection.query("START TRANSACTION;");
  try {
    const result = await action(connection, ...args);
    return result;
  } catch (error) {
    logger.logError(error, { message: "Transaction failed in runAndRollback" });
    // it's okay to throw because this is just a wrapper
    throw error;
  } finally {
    await connection.query("ROLLBACK;");
  }
}
