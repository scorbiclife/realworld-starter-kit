import { Connection as MysqlConnection } from "mysql2/promise";

export type TransactionRunner = <A extends any[], R, E>(
  action: (connection: MysqlConnection, ...args: A) => Promise<R, E>,
  connection: MysqlConnection,
  ...args: A
) => Promise<R, E>;
