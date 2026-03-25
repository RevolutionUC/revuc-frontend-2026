import { db } from "./db";
import { scheduleEvents } from "./db/schema";
import { asc } from "drizzle-orm";

export async function getSchedule() {
  try {
    // Fetches all events and sorts them by start time
    return await db.select().from(scheduleEvents).orderBy(asc(scheduleEvents.startTime));
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    return [];
  }
}