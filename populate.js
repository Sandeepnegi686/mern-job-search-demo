import dotenv from "dotenv";
dotenv.config();

import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import JobModel from "./model/JobModel.js";

import connectDB from "./db/connection.js";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_DB_URL);

    // Resolve the path to the local JSON file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = join(__dirname, "mock_data.json");

    const jsonJobs = JSON.parse(await readFile(filePath, "utf8"));

    await JobModel.deleteMany();

    await JobModel.create(jsonJobs);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
