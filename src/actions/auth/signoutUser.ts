"use server";

import { db } from "@/db";
import { activeUsers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function signoutUser(email: string, sessionToken: string) {
  await db
    .delete(activeUsers)
    .where(
      and(
        eq(activeUsers.email, email),
        eq(activeUsers.sessionToken, sessionToken)
      )
    );
}
