"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection_problem = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    "host": "localhost",
    "user": "postgres",
    "port": 5432,
    "database": "users",
    "password": "postgres",
    "max": 10
});
exports.connection_problem = false;
pool.connect(err => {
    if (err)
        return exports.connection_problem = true;
    else
        return exports.connection_problem = false;
});
exports.default = pool;
