import mysql from "mysql2/promise";
import { connectionSettings } from "./connectionSettings.js";

export const connectionPool = mysql.createPool(connectionSettings);
