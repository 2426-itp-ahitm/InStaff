import { Activity } from "src/models/Activity";

const BASE_URL = "http://localhost:3000"

export async function loadAllActivities(): Promise<Activity[]> {
   const response = await fetch(`${BASE_URL}/activity`);
   const activities: Activity[] = await response.json()
   
   return activities
}
