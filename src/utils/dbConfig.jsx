import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
    "postgresql://cancer_treatment_owner:Ao9IPjHt5DXQ@ep-super-frog-a50hk17d.us-east-2.aws.neon.tech/cancer_treatment?sslmode=require"
);
export const db = drizzle(sql, { schema });