import * as dotenv from "dotenv";
import * as path from "path";
const configFile = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}`
  : ".env";
dotenv.config({
  path: path.resolve(process.cwd(), configFile),
});
