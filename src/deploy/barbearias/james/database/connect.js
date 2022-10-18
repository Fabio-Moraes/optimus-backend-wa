"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql_1 = __importDefault(require("mysql"));
exports.db = mysql_1.default.createPool({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b6e5116b10a3f3',
    password: 'f44c1bed',
    database: 'heroku_4e63847dfe579bb',
});
// mysql -h us-cdbr-east-05.cleardb.net -u b6e5116b10a3f3 -p
