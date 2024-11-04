import { FieldOfActivity } from "src/models/fieldOfActivity";

const BASE_URL = "http://localhost:3000"

export async function loadAllFieldsOfActivity(): Promise<FieldOfActivity[]> {
   const response = await fetch(`${BASE_URL}/fields-of-activity`);
   const fieldsOfActivity: FieldOfActivity[] = await response.json()
   
   return fieldsOfActivity
}
