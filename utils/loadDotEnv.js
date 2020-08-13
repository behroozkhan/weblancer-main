import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();
console.log("configing", __dirname + "/.env");
dotenv.config({ path: __dirname + "/.env" });

export default dotenv;