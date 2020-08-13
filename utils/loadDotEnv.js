import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();
console.log("configing", __dirname + "/.env", process.env);
dotenv.config({ path: __dirname + "/.env" });

console.log("configed", __dirname + "/.env", process.env);

export default dotenv;