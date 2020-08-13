import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();
console.log("configing", __dirname + "/.env", process.env.DATABASE_USER);
dotenv.config({ path: __dirname + "/.env" });

console.log("configed", __dirname + "/.env", process.env.DATABASE_USER);

export default dotenv;