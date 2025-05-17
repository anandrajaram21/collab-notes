import { db } from "./index";
import * as dotenv from "dotenv";

dotenv.config();

async function cleanup() {
  try {
    // Drop tables if they exist, one at a time using Drizzle's execute
    await db.execute(`DROP TABLE IF EXISTS connected_users CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS notes CASCADE`);
    console.log("Tables dropped successfully");
  } catch (error) {
    console.error("Error dropping tables:", error);
  }
}

cleanup();
