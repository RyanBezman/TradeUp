"use server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
type ColumnLabel =
  | "firstName"
  | "lastName"
  | "email"
  | "city"
  | "state"
  | "phone"
  | "zip"
  | "country"
  | "job";

export async function updateUser(
  id: number,
  column: ColumnLabel,
  value: string
) {
  await db
    .update(users)
    .set({ [column]: value })
    .where(eq(users.id, id));
}
