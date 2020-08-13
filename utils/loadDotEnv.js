import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();
dotenv.config({ path: __dirname + "/.env" });

export default dotenv;