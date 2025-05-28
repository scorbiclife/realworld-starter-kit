export class MysqlTransactionWrapper {
  /**
   * We save the connection instead of the pool to guarantee
   * that the statements are executed on the same connection
   * inside a transaction.
   *
   * @param {object} param0
   * @property {Connection} param0.connection
   */
  constructor({ connection }) {
    this.connection = connection;
  }

  /**
   * Wrap the given action inside a transaction.
   *
   * @template {any[]} Args
   * @template {unknown} Result
   * @template {unknown} Error
   * @param {(connection: import("mysql2/promise").Connection, ...args: Args) => Promise<Result, Error>} action
   * @param {Args} args
   * @returns {Promise<Result, Error>}
   */
  async runAsTransaction(action, ...args) {
    this.connection.query("START TRANSACTION;");
    let result;
    try {
      result = await action(this.connection, ...args);
    } catch (error) {
      this.connection.query("ROLLBACK;");
      throw error;
    }
    this.connection.query("COMMIT;");
    return result;
  }

  /**
   * Wrap the given action inside a transaction with rollback.
   *
   * @template {any[]} Args
   * @template {unknown} Result
   * @template {unknown} Error
   * @param {(connection: import("mysql2/promise").Connection, ...args: Args) => Promise<Result, Error>} action
   * @param {Args} args
   * @returns {Promise<Result, Error>}
   */
  async autoRollback(action, ...args) {
    this.connection.query("START TRANSACTION;");
    let result;
    try {
      result = await action(this.connection, ...args);
    } catch (error) {
      throw error;
    } finally {
      this.connection.query("ROLLBACK;");
    }
    return result;
  }
}
